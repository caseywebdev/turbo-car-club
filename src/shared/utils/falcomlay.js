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
  context = {},
  force = false,
  change = [],
  db = {},
  watchers,
  bailOnError = false,
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
          const [resolved] = resolvePath(db, path);
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
      for (let [fn, {arity, options}] of jobs) {
        work.push(Promise
          .resolve(options)
          .then(fn)
          .catch(er => {
            if (bailOnError) throw er;
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
            applyChange(db, newChange, watchers);
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

export const toKeys = arr => {
  const keys = [];
  for (let i = 0, l = arr.length; i < l; ++i) keys.push(toKey(arr[i]));
  return keys;
};

export const toKey = obj =>
  isArray(obj) ? JSON.stringify(toKeys(obj)) :
  isObject(obj) ? JSON.stringify(orderObj(obj)) :
  String(obj);

export const get = (db, path) => {
  let cursor = db;
  for (let i = 0, l = path.length; i < l && cursor != null; ++i) {
    if (cursor = cursor[toKey(path[i])]) {
      const {$error, $ref} = cursor;
      if ($error) return toError($error);
      if ($ref) cursor = get(db, $ref);
    }
  }
  return cursor;
};

export const resolvePath = (db, path, paths = []) => {
  let cursor = db;
  paths.unshift(path);
  for (let i = 0, l = path.length; i < l && cursor != null; ++i) {
    if (cursor = cursor[toKey(path[i])]) {
      const {$ref} = cursor;
      if ($ref) {
        return resolvePath(db, $ref.concat(path.slice(i + 1)), paths);
      }
    }
  }
  return paths;
};

export const set = (db, path, value, watchers) => {
  const paths = [];
  const resolved = resolvePath(db, path.slice(0, -1));
  const tail = path[path.length - 1];
  for (let i = 0, l = resolved.length; i < l; ++i) {
    const path = resolved[i].concat(tail);
    paths.push(path);
    if (watchers) trigger(watchers, path);
  }
  let cursor = db;
  for (let i = 0, l = paths[0].length; i < l; ++i) {
    const key = toKey(paths[0][i]);
    if (i === l - 1) return cursor[key] = value;
    if (cursor[key] == null) cursor[key] = {};
    cursor = cursor[key];
  }
};

export const applyChange = (db, change, watchers) => {
  if (!change) return;
  if (!isArray(change)) return set(db, change.path, change.value, watchers);
  for (let i = 0, l = change.length; i < l; ++i) {
    applyChange(db, change[i], watchers);
  }
};

const toError = attrs => {
  const er = new Error();
  for (let key in attrs) try { er[key] = attrs[key]; } catch (er) {}
  return er;
};

let nextFnid = 1;
export const watch = (watchers, path, cb) => {
  const key = toKey(path);
  let {__FNID__: fnid} = cb;
  if (!fnid) fnid = cb.__FNID__ = nextFnid++;

  if (!watchers[key]) watchers[key] = {};
  watchers[key][fnid] = cb;

  if (!watchers[fnid]) watchers[fnid] = {};
  watchers[fnid][key] = true;
};

export const unwatch = (watchers, path, cb) => {
  if (typeof path === 'function') {
    const {__FNID__: fnid} = path;
    for (let key in watchers[fnid]) unwatch(watchers, key, path);
    return;
  }

  const key = toKey(path);
  const {__FNID__: fnid} = cb;

  if (watchers[key]) {
    delete watchers[key][fnid];
    if (!Object.keys(watchers[key]).length) delete watchers[key];
  }

  if (watchers[fnid]) {
    delete watchers[fnid][key];
    if (!Object.keys(watchers[fnid]).length) delete watchers[fnid];
  }
};

export const trigger = (watchers, path) => {
  const pending = watchers.pending || [];
  pending.push(path);
  if (!watchers.pending) {
    watchers.pending = pending;
    setTimeout(invoke.bind(null, watchers));
  }
};

export const invoke = watchers => {
  const pending = watchers.pending;
  delete watchers.pending;
  const keyHits = {};
  const fnHits = {};
  for (let i = 0, l = pending.length; i < l; ++i) {
    const path = pending[i];
    for (let j = path.length; j >= 0; --j) {
      const key = toKey(path.slice(0, j));
      if (keyHits[key]) break;
      keyHits[key] = true;
      for (let fnid in watchers[key]) {
        if (fnHits[fnid]) continue;
        fnHits[fnid] = true;
        watchers[key][fnid]();
      }
    }
  }
};

export class Router {
  constructor({routes: DEFAULT_ROUTES} = {}) {
    this.routes = createRouter(routes);
  }

  run({
    query = [],
    context = {},
    force = false,
    change = [],
    store = new Store(),
    watchers,
    bailOnError = false,
    onlyUnresolved = false
  }) {
    return Promise
      .resolve()
      .then(() => {
        let paths = queryToPaths(query);
        if (!force) {
          const undefPaths = [];
          for (let i = 0, l = paths.length; i < l; ++i) {
            const path = paths[i];
            const [resolved] = resolvePath(db, path);
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
        for (let [fn, {arity, options}] of jobs) {
          work.push(Promise
            .resolve(options)
            .then(fn)
            .catch(er => {
              if (bailOnError) throw er;
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
              applyChange(db, newChange, watchers);
              change.push(newChange);
            })
          );
        }

        const recurse = () =>
          this.run({
            store,
            query: [unresolvedPaths],
            context,
            change,
            bailOnError,
            onlyUnresolved: true
          });

        return Promise.all(work).then(recurse);
      });
}

export class Run {
  constructor({
    router: DEFAULT_ROUTER,
    query = [],
    context = {},
    force = false,
    store = new Store(),
    watchers,
    bailOnError = false,
    onlyUnresolved = false
  } = {}) {
    this.router = router,
    this.query = query;
    this.context = {};
    this.force = force;
    this.change = change = [];
    this.store = store;
    this.bailOnError = bailOnError;
    this.onlyUnresolved = onlyUnresolved;
  }

  start() {
    return Promise.resolve().then(() => {
      const paths = this.getPaths();  
    });
  }
}

const ROUTE_NOT_FOUND_ERROR = new Error('Route not found');
const DEFAULT_ROUTES = {'*': () => { throw ROUTE_NOT_FOUND_ERROR; }};
const DEFAULT_ROUTER = new Router({routes: DEFAULT_ROUTES});

export class Store {
  constructor({cache = {}, router = DEFAULT_ROUTER} = {}) {
    this.cache = cache;
    this.router = router;
    this.watchers = {};
  }

  run({query, context, force = false, bailOnError = false}) {
    return this.router.run({store: this, query, context, force, bailOnError});
  }
}

console.log(new Router({routes: {'foo|bar': () => {}}}));

// store
//   .run({query: ['verify!', {token: 'xxx'}], bailOnError: true})
//   .then(() => {})
//   .catch(er => {});
