const isObject = obj => typeof obj === 'object' && obj !== null;

const isArray = Array.isArray;

export const queryToPaths = (query, path = []) => {
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

const getQueryCost = (query, limit = Infinity, cost = 0, total = 0) => {
  let i = 0;
  const l = query.length;
  while (i < l && total + cost + i <= limit && !isArray(query[i])) ++i;

  if (total + (cost += i) > limit || i === l) return total + cost;

  const pivot = query[i];
  const rest = query.slice(i + 1);
  for (let i = 0, l = pivot.length; i < l; ++i) {
    total = getQueryCost([].concat(pivot[i], rest), limit, cost, total);
    if (total > limit) return total;
  }

  return total;
};

const routeToQuery = route => {
  const path = route.split('.');
  for (let i = 0, l = path.length; i < l; ++i) path[i] = path[i].split('|');
  return path;
};

const pathToRoute = path => path.join('.');

const pathSegmentToRouteQuerySegment = segment =>
  isObject(segment) ? '$params' : [segment, '$key'];

const flattenRoutes = routes => {
  const flattened = {};
  for (let route in routes) {
    const fn = routes[route];
    const paths = queryToPaths(routeToQuery(route));
    for (let i = 0, l = paths.length; i < l; ++i) {
      const path = paths[i];
      const route = pathToRoute(path);
      flattened[route] = {fn, arity: route === '*' ? 0 : path.length};
    }
  }
  return flattened;
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

const toKeys = arr => {
  const keys = [];
  for (let i = 0, l = arr.length; i < l; ++i) keys.push(toKey(arr[i]));
  return keys;
};

const toKey = obj =>
  isArray(obj) ? JSON.stringify(toKeys(obj)) :
  isObject(obj) ? JSON.stringify(orderObj(obj)) :
  String(obj);

let nextFnid = 1;
const getFnid = fn => fn.__FNID__ || (fn.__FNID__ = nextFnid++);

const ROUTE_NOT_FOUND_ERROR = new Error('Route not found');
const EXPENSIVE_QUERY_ERROR = new Error('Query is too expensive');
const DEFAULT_ROUTES = {'*': () => { throw ROUTE_NOT_FOUND_ERROR; }};

export class Router {
  constructor({maxQueryCost, routes = DEFAULT_ROUTES} = {}) {
    this.routes = flattenRoutes(routes);
    if (maxQueryCost) this.maxQueryCost = maxQueryCost;
  }

  getRouteForPath(path) {
    const {routes} = this;
    const query = [];
    for (let i = 0, l = path.length; i < l; ++i) {
      query[i] = pathSegmentToRouteQuerySegment(path[i]);
    }

    for (let i = query.length; i > 0; --i) {
      const paths = queryToPaths(query.slice(0, i));
      for (let j = 0, l = paths.length; j < l; ++j) {
        const route = routes[pathToRoute(paths[j])];
        if (route) return route;
      }
    }

    return routes['*'];
  }

  run({
    query = [],
    context = {},
    force = false,
    change = [],
    store = new Store(),
    onlyUnresolved = false
  }) {
    return Promise.resolve().then(() => {
      const {maxQueryCost: limit} = this;
      if (limit && getQueryCost(query, limit) > limit) {
        throw EXPENSIVE_QUERY_ERROR;
      }

      let paths = queryToPaths(query);
      if (!force) {
        const undefPaths = [];
        for (let i = 0, l = paths.length; i < l; ++i) {
          const path = paths[i];
          const [resolved] = store.resolvePath(path);
          if (onlyUnresolved && path === resolved) continue;
          if (store.get(resolved) === undefined) undefPaths.push(resolved);
        }
        paths = undefPaths;
      }

      if (!paths.length) return change;

      const jobs = {};
      const unresolvedPaths = [];
      for (let i = 0, l = paths.length; i < l; ++i) {
        const path = paths[i];
        let route = this.getRouteForPath(path);
        if (!route) continue;
        const {fn, arity} = route;

        if (path.length > arity && arity > 0) unresolvedPaths.push(path);

        const fnid = getFnid(fn);
        let job = jobs[fnid];
        if (!job) {
          job = jobs[fnid] = {
            fn,
            options: {context, store, paths: []},
            keys: []
          };
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
      for (let fnid in jobs) {
        const {fn, options} = jobs[fnid];
        work.push(Promise.resolve(options).then(fn).then(newChange => {
          store.applyChange(newChange);
          change.push(newChange);
        }));
      }

      const recurse = () =>
        this.run({
          query: [unresolvedPaths],
          context,
          change,
          store,
          onlyUnresolved: true
        });

      return Promise.all(work).then(recurse);
    });
  }
}

const DEFAULT_ROUTER = new Router();

export class Store {
  constructor({cache = {}, router = DEFAULT_ROUTER, maxRefDepth = 3} = {}) {
    this.cache = cache;
    this.router = router;
    this.watchers = {};
    this.maxRefDepth = maxRefDepth;
  }

  resolveRefs(obj, depth = 0) {
    if (!isObject(obj)) return obj;

    if (isArray(obj)) {
      const val = [];
      for (let i = 0, l = obj.length; i < l; ++i) {
        val.push(this.resolveRefs(obj[i], depth));
      }
      return val;
    }

    const {$ref} = obj;
    if ($ref) return this.get($ref, depth + 1);

    const val = {};
    for (let key in obj) val[key] = this.resolveRefs(obj[key], depth);
    return val;
  }

  get(path, depth = 0) {
    if (depth > this.maxRefDepth) return {$ref: path};
    let cursor = this.cache;
    for (let i = 0, l = path.length; i < l && cursor != null; ++i) {
      if (cursor = cursor[toKey(path[i])]) {
        const {$ref} = cursor;
        if ($ref) cursor = this.get($ref, depth);
      }
    }
    return this.resolveRefs(cursor, depth);
  }

  set(path, value) {
    const paths = [];
    const resolved = this.resolvePath(path.slice(0, -1));
    const tail = path[path.length - 1];
    for (let i = 0, l = resolved.length; i < l; ++i) {
      const path = resolved[i].concat(tail);
      paths.push(path);
      this.trigger(path);
    }
    let cursor = this.cache;
    for (let i = 0, l = paths[0].length; i < l; ++i) {
      const key = toKey(paths[0][i]);
      if (i === l - 1) return cursor[key] = value;
      if (cursor[key] == null) cursor[key] = {};
      cursor = cursor[key];
    }
    return this;
  }

  resolvePath(path, paths = []) {
    paths.unshift(path);
    let cursor = this.cache;
    for (let i = 0, l = path.length; i < l && cursor != null; ++i) {
      if (cursor = cursor[toKey(path[i])]) {
        const {$ref} = cursor;
        if ($ref) {
          return this.resolvePath($ref.concat(path.slice(i + 1)), paths);
        }
      }
    }
    return paths;
  }

  applyChange(change) {
    if (!change) return;
    if (!isArray(change)) return this.set(change.path, change.value);
    for (let i = 0, l = change.length; i < l; ++i) this.applyChange(change[i]);
  }

  run(options) {
    return this.router.run({...options, store: this});
  }

  watch(path, cb) {
    const key = toKey(path);
    const fnid = getFnid(cb);

    const {watchers} = this;
    if (!watchers[key]) watchers[key] = {};
    watchers[key][fnid] = cb;

    if (!watchers[fnid]) watchers[fnid] = {};
    watchers[fnid][key] = true;
  }

  unwatch(path, cb) {
    const {watchers} = this;
    if (typeof path === 'function') {
      const fnid = getFnid(path);
      for (let key in watchers[fnid]) this.unwatch(key, path);
      return;
    }

    const key = toKey(path);
    const fnid = getFnid(cb);

    if (watchers[key]) {
      delete watchers[key][fnid];
      if (!Object.keys(watchers[key]).length) delete watchers[key];
    }

    if (watchers[fnid]) {
      delete watchers[fnid][key];
      if (!Object.keys(watchers[fnid]).length) delete watchers[fnid];
    }
  }

  trigger(path) {
    const {watchers} = this;
    const pending = watchers.pending || [];
    pending.push(path);
    if (!watchers.pending) {
      watchers.pending = pending;
      setTimeout(() => this.flushPending());
    }
  }

  flushPending() {
    const {watchers, watchers: {pending}} = this;
    if (!pending) return;
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
  }
}
