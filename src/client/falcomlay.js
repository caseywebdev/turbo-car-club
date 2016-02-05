const isObject = obj => typeof obj === 'object' && obj !== null;
const isArray = Array.isArray;

const flatten = arr => {
  let i = 0;
  const l = arr.length;
  while (i < l && !isArray(arr[i])) ++i;

  if (i === l) return arr;

  const flattened = arr.slice(0, i);
  const pivot = arr[i];
  const rest = arr.slice(i + 1);
  for (let i = 0, l = pivot.length; i < l; ++i) {
    flattened.push.apply(flattened, flatten([].concat(pivot[i], rest)));
  }
  return flattened;
};

const extend = (a, b) => {
  for (let key in b) a[key] = b[key];
  return a;
};

const queryToPaths = (query, path = []) => {
  let i = 0;
  const l = query.length;
  while (i < l && !isArray(query[i])) ++i;

  if (i === l) return [path.concat(query)];

  const paths = [];
  path = path.concat(query.slice(0, i));
  const pivot = query[i];
  const rest = query.slice(i + 1);
  for (let i = 0, l = pivot.length; i < l; ++i) {
    paths.push.apply(paths, queryToPaths([].concat(pivot[i], rest), path));
  }
  return paths;
};

const queriesToPaths = queries => {
  const paths = [];
  for (let i = 0, l = queries.length; i < l; ++i) {
    paths.push.apply(paths, queryToPaths(queries[i]));
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

const getRouteForPath = (router, path) => {
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

  return router.$fallback;
};

const EXPENSIVE_QUERY_ERROR = new Error('Query is too expensive');

export const createRouter = routes => {
  if (!routes.$fallback) throw new Error('A $fallback route is required');
  const router = {};
  for (let route in routes) {
    const fn = routes[route];
    const paths = queryToPaths(routeToQuery(route));
    for (let i = 0, l = paths.length; i < l; ++i) {
      const path = paths[i];
      const route = pathToRoute(path);
      const arity = route === '$fallback' ? 0 : path.length;
      router[route] = {fn, arity};
    }
  }
  return router;
};

export const run = ({maxCost, router, queries, context, pathValues = [], data = {}}) =>
  Promise
    .resolve()
    .then(() => limitQueriesCost(queries, maxCost))
    .then(() => {
      const tasks = new Map();
      const incompletePaths = [];
      const paths = queriesToPaths(queries);
      for (let i = 0, l = paths.length; i < l; ++i) {
        const path = paths[i];
        const {fn, arity} = getRouteForPath(router, path);

        if (path.length > arity && arity > 0) incompletePaths.push(path);

        let task = tasks.get(fn);
        if (!task) {
          task = {arity, options: {context, data, paths: []}, keys: []};
          tasks.set(fn, task);
        }

        const {keys, options} = task;
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

      const taskPromises = [];
      for (const [fn, {arity, options}] of tasks) {
        taskPromises.push(Promise
          .resolve(options)
          .then(fn)
          .catch(er => {
            const {name, message} = er;
            const value = {$error: {name, message, ...er}};
            const pathValues = [];
            const {paths} = options;
            for (let i = 0, l = paths.length; i < l; ++i) {
              pathValues.push({path: paths[i].slice(0, arity), value});
            }
          })
          .then(_pathValues => {
            _pathValues = flatten([_pathValues]);
            applyPathValues(data, _pathValues);
            pathValues.push.apply(pathValues, _pathValues);
          })
        );
      }

      return Promise.all(taskPromises).then(() => {
        const queries = [];
        for (let i = 0, l = incompletePaths.length; i < l; ++i) {
          const path = incompletePaths[i];
          const resolved = resolvePath(data, path);
          if (path !== resolved && get(data, resolved) === undefined) {
            queries.push(resolved);
          }
        }
        if (!queries.length) return pathValues;
        return run({maxCost, router, queries, context, pathValues, data});
      });
    });

const limitQueryCost = (path, max, precost = 0) => {
  let i = 0;
  const l = path.length;
  while (i < l && !isArray(path[i])) ++i;

  if ((precost += i) > max) throw EXPENSIVE_QUERY_ERROR;

  if (i === l) return precost;

  let cost = 0;
  const first = path[i];
  const rest = path.slice(i + 1);
  for (let i = 0, l = first.length; i < l; ++i) {
    cost += limitQueryCost([].concat(first[i], rest), max, precost);
    if (cost > max) throw EXPENSIVE_QUERY_ERROR;
  }

  return cost;
};

const limitQueriesCost = (queries, max) => {
  let cost = 0;
  for (let i = 0, l = queries.length; i < l; ++i) {
    cost += limitQueryCost(queries[i], max);
    if (cost > max) throw EXPENSIVE_QUERY_ERROR;
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

const toKey = obj => isObject(obj) ? JSON.stringify(orderObj(obj)) : obj;

const resolveRefs = (data, obj, maxDepth, depth = 0) => {
  if (!isObject(obj)) return obj;

  if (isArray(obj)) {
    const arr = [];
    for (let i = 0, l = obj.length; i < l; ++i) {
      arr[i] = resolveRefs(data, obj[i], maxDepth, depth);
    }
    return arr;
  }

  const {$error, $ref} = obj;
  if ($error) return extend(new Error(), $error);
  if ($ref) return get(data, $ref, maxDepth, depth + 1);

  const newObj = {};
  for (let key in obj) {
    newObj[key] = resolveRefs(data, obj[key], maxDepth, depth);
  }
  return newObj;
};

const walk = (data, path) => {
  let val = data;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    if (val = val[toKey(path[i])]) {
      const {$error, $ref} = val;
      if ($error) return extend(new Error(), $error);
      if ($ref) val = walk(data, $ref);
    }
  }
  return val;
};

export const get = (data, path, maxDepth = 3, depth = 0) => {
  if (depth > maxDepth) return {$ref: path};
  return resolveRefs(data, walk(data, path), maxDepth, depth);
};

const resolvePath = (data, path) => {
  let val = data;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    if (val = val[toKey(path[i])]) {
      const {$ref} = val;
      if ($ref) return resolvePath(data, $ref.concat(path.slice(i + 1)));
    }
  }
  return path;
};

export const set = (data, path, value) => {
  path = resolvePath(data, path.slice(0, -1)).concat(path.slice(-1));
  let cursor = data;
  for (var i = 0, l = path.length; i < l; ++i) {
    const key = toKey(path[i]);
    if (i === l - 1) return cursor[key] = value;
    if (cursor[key] == null) cursor[key] = {};
    cursor = cursor[key];
  }
};

export const applyPathValues = (data, pathValues) => {
  for (let i = 0, l = pathValues.length; i < l; ++i) {
    const {path, value} = pathValues[i];
    set(data, path, value);
  }
};
