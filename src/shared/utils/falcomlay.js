const isObject = obj => typeof obj === 'object' && obj !== null;
const isArray = Array.isArray;

export const queryToPaths = (query, path = []) => {
  let i = 0;
  for (const l = query.length; i < l && !isArray(query[i]); ++i) {
    if (i === l - 1) return [path.concat(query)];
  }

  const paths = [];
  path = path.concat(query.slice(0, i));
  const pivot = query[i];
  const rest = query.slice(i + 1);
  for (let i = 0, l = pivot.length; i < l; ++i) {
    paths.push.apply(paths, queryToPaths([].concat(pivot[i], rest), path));
  }
  return paths;
};

const routeToQuery = route => {
  const path = route.split('.');
  for (let i = 0, l = path.length; i < l; ++i) path[i] = path[i].split('|');
  return path;
};

const pathToRoute = path => path.join('.');

const pathSegmentToRouteQuerySegment = segment =>
  isObject(segment) ? '$params' : [segment, '$key'];

export const getRouteForPath = (router, path) => {
  const query = [];
  for (let i = 0, l = path.length; i < l; ++i) {
    query[i] = pathSegmentToRouteQuerySegment(path[i]);
  }

  for (let i = query.length; i > 0; --i) {
    const paths = queryToPaths(query.slice(0, i));
    for (let j = 0, l = paths.length; j < l; ++j) {
      const route = router[pathToRoute(paths[j])];
      if (route) return route;
    }
  }

  return router['*'];
};

export const createRouter = routes => {
  const router = {};
  for (let route in routes) {
    const fn = routes[route];
    const paths = queryToPaths(routeToQuery(route));
    for (let i = 0, l = paths.length; i < l; ++i) {
      const path = paths[i];
      const route = pathToRoute(path);
      router[route] = {fn, arity: route === '*' ? 0 : path.length};
    }
  }
  return router;
};

export const run = ({
  router = {},
  query = [],
  context,
  force = false,
  change = [],
  db = {},
  onlyUnresolved = false
}) =>
  Promise
    .resolve()
    .then(() => {
      let paths = queryToPaths(query);
      if (!force) {
        const undefPaths = [];
        for (let i = 0, l = paths.length; i < l; ++i) {
          const path = paths[i];
          const resolved = resolvePath(db, path);
          if (onlyUnresolved && path === resolved) continue;
          if (get(db, resolved) === undefined) undefPaths.push(resolved);
        }
        paths = undefPaths;
      }

      if (!paths.length) return change;

      const jobs = new Map();
      const unresolvedPaths = [];
      for (let i = 0, l = paths.length; i < l; ++i) {
        const path = paths[i];
        let route = getRouteForPath(router, path);
        if (!route) continue;
        const {fn, arity} = route;

        if (path.length > arity && arity > 0) unresolvedPaths.push(path);

        let job = jobs.get(fn);
        if (!job) {
          job = {arity, options: {context, db, paths: []}, keys: []};
          jobs.set(fn, job);
        }

        const {keys, options} = job;
        options.paths.push(path);

        for (let i = 0; i < arity; ++i) {
          if (!options[i]) {
            options[i] = [];
            keys[i] = {};
          }
          const segment = path[i];
          const key = toKey(segment);
          if (keys[i][key]) continue;
          options[i].push(segment);
          keys[i][key] = true;
        }
      }

      const work = [];
      for (const [fn, {arity, options}] of jobs) {
        work.push(Promise
          .resolve(options)
          .then(fn)
          .catch(er => {
            let $error = er;
            if (er instanceof Error) {
              $error = {name: er.name, message: er.message, ...er};
            }
            const value = {$error};
            const change = [];
            const {paths} = options;
            for (let i = 0, l = paths.length; i < l; ++i) {
              const path = arity > 0 ? paths[i].slice(0, arity) : paths[i];
              change.push({path, value});
            }
            return change;
          })
          .then(newChange => {
            applyChange(db, newChange);
            change.push(newChange);
          })
        );
      }

      const recurse = () =>
        run({
          router,
          query: [unresolvedPaths],
          context,
          change,
          db,
          onlyUnresolved: true
        });

      return Promise.all(work).then(recurse);
    });

export const getQueryCost = (query, limit = Infinity, precost = 0) => {
  let i = 0;
  for (const l = query.length; i < l && !isArray(query[i]); ++i) {
    if (++precost > limit || i === l - 1) return precost;
  }

  let cost = 0;
  const pivot = query[i];
  const rest = query.slice(i + 1);
  for (let i = 0, l = pivot.length; i < l; ++i) {
    cost += getQueryCost([].concat(pivot[i], rest), limit, precost);
    if (cost > limit) return cost;
  }

  return cost;
};

const orderObj = obj => {
  if (!isObject(obj)) return obj;

  if (isArray(obj)) {
    const val = [];
    for (let i = 0, l = obj.length; i < l; ++i) val.push(orderObj(obj[i]));
    return val;
  }

  const val = {};
  const keys = Object.keys(obj).sort();
  for (let i = 0, l = keys.length; i < l; ++i) {
    val[keys[i]] = orderObj(obj[keys[i]]);
  }
  return val;
};

export const toKey = obj => isObject(obj) ? JSON.stringify(orderObj(obj)) : obj;

export const get = (db, path, cursor) => {
  let val = cursor || db;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    if (val = val[toKey(path[i])]) {
      const {$error, $ref} = val;
      if ($error) return toError($error);
      if ($ref) val = get(db, $ref);
    }
  }
  return val;
};

export const resolvePath = (db, path) => {
  let val = db;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    if (val = val[toKey(path[i])]) {
      const {$ref} = val;
      if ($ref) return resolvePath(db, $ref.concat(path.slice(i + 1)));
    }
  }
  return path;
};

export const set = (db, path, value) => {
  path = resolvePath(db, path.slice(0, -1)).concat(path.slice(-1));
  let cursor = db;
  for (let i = 0, l = path.length; i < l; ++i) {
    const key = toKey(path[i]);
    if (i === l - 1) return cursor[key] = value;
    if (cursor[key] == null) cursor[key] = {};
    cursor = cursor[key];
  }
};

export const applyChange = (db, change) => {
  if (!change) return;
  if (!isArray(change)) return set(db, change.path, change.value);
  for (let i = 0, l = change.length; i < l; ++i) applyChange(db, change[i]);
};

const toError = attrs => {
  const er = new Error();
  for (const key in attrs) try { er[key] = attrs[key]; } catch (er) {}
  return er;
};
