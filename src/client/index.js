import './utils/set-global';
import './utils/livereload';
// import React from 'react';
// import {render} from 'react-dom';
// import {Router, hashHistory as history} from 'react-router';
// import routes from './routes';
//
// render(<Router {...{history, routes}} />, document.getElementById('main'));

// import live from './utils/live';
//
// live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

// import Peer from '../../shared/peer';

// live.on('signal', ({data}) => window.host.signal(data));
// const setHost = id => {
//   window.host = new Peer()
//     .on('signal', data => live.send('signal', {id, data}))
//     .on('u', t => console.log(Date.now(), t))
//     .on('close', () => setHost(id))
//     .call();
// };

import _ from 'underscore';

// const objToString = Object.prototype.toString;
const isObject = obj => typeof obj === 'object' && obj !== null;
// const isPojo = obj => objToString.apply(obj) === '[object Object]';
const isArray = Array.isArray;

const queryToPaths = (query, path = []) => {
  let i = 0;
  const l = query.length;
  while (i < l && !isArray(query[i])) ++i;

  if (i === l) return [path.concat(query)];

  const paths = [];
  path = path.concat(query.slice(0, i));
  const first = query[i];
  const rest = query.slice(i + 1);
  for (let i = 0, l = first.length; i < l; ++i) {
    paths.push.apply(paths, queryToPaths([].concat(first[i], rest), path));
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

const routeToQuery = path => _.invoke(path.split('.'), 'split', '|');

const pathToRoute = path => path.join('.');

const pathSegmentToRouteQuerySegment = segment =>
  isObject(segment) ? '$params' : [segment, '$key'];

const getRouteForPath = (router, path) => {
  for (let i = path.length; i > 0; --i) {
    const paths =
      queryToPaths(_.map(path.slice(0, i), pathSegmentToRouteQuerySegment));
    for (let j = 0, l = paths.length; j < l; ++j) {
      const route = router[pathToRoute(paths[j])];
      if (route) return route;
    }
  }
  return router.$fallback;
};

const ROUTE_NOT_FOUND_ERROR = new Error('No matching route found');
const EXPENSIVE_QUERY_ERROR = new Error('Query is too expensive');
const DEFAULT_FALLBACK = () => { throw ROUTE_NOT_FOUND_ERROR; };

const createRouter = routes => {
  routes = _.extend({$fallback: DEFAULT_FALLBACK}, routes);
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

const run = ({maxCost, router, queries, context, pathValues = [], data = {}}) =>
  Promise
    .resolve()
    .then(() => limitQueriesCost(queries, maxCost))
    .then(() => {
      const tasks = [];
      const incompletePaths = [];
      const paths = queriesToPaths(queries);
      for (let i = 0, l = paths.length; i < l; ++i) {
        const path = paths[i];
        const {fn, arity} = getRouteForPath(router, path);

        if (path.length > arity && arity > 0) incompletePaths.push(path);

        let task = _.find(tasks, {fn});
        if (!task) {
          task = {fn, arity, options: {context, data, paths: []}};
          tasks.push(task);
        }

        const {options} = task;
        options.paths.push(path);

        for (let i = 0; i < arity; ++i) {
          if (!options[i]) options[i] = [];
          const arg = path[i];
          if (_.any(options[i], _.partial(_.isEqual, arg))) continue;
          options[i].push(arg);
        }
      }

      return Promise
        .all(_.map(tasks, ({fn, arity, options}) =>
          Promise
            .resolve(options)
            .then(fn)
            .catch(er => {
              const {name, message} = er;
              const value = {$error: {name, message, ...er}};
              return _.map(options.paths, path => ({
                path: path.slice(0, arity),
                value
              }));
            })
            .then(_pathValues => {
              _pathValues = _.flatten([_pathValues]);
              applyPathValues(data, _pathValues);
              pathValues.push.apply(pathValues, _pathValues);
            })
        ))
        .then(() => {
          const queries = _.reduce(incompletePaths, (queries, path) => {
            const resolved = resolvePath(data, path);
            if (path !== resolved && get(data, resolved) === undefined) {
              queries.push(resolved);
            }
            return queries;
          }, []);
          if (!queries.length) return pathValues;
          return run({maxCost, router, queries, context, pathValues, data});
        });
    });

const router = createRouter({
  'hosts.$params.$key':
    ({1: params, 2: indices}) =>
      _.map(params, params =>
        _.map(indices, index => ({
          path: ['hosts', params, index],
          value: {$ref: ['hostsById', '1-Larry']}
        }))
      ),
  'hostsById.$key.id|name|owner':
    ({1: ids, 2: keys}) =>
      _.map(ids, id =>
        _.map(keys, key => ({
          path: ['hostsById', id, key],
          value: `Some value for ${id}-${key}`
        }))
      ),
  user:
    ({context: {userId}}) => {
      if (!userId) throw new Error('Auth required');
      return {path: ['user'], value: {$ref: ['usersById', userId]}};
    },
  'usersById.$key.id|name|emailAddress':
    ({1: ids, 2: keys}) =>
      _.map(ids, id =>
        _.map(keys, key =>
          ({path: ['usersById', id, key], value: Math.random()})
        )
      ),
  'user!.$params': ({context: {userId}, 1: params}) => {
    if (!userId) throw new Error('Auth required');
    return _.map(params, params =>
      _.map(params, (val, key) =>
        ({path: ['usersById', userId, key], value: val})
      )
    ).concat({path: ['user'], value: {$ref: ['usersById', userId]}});
  }
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
  for (var i = 0, l = queries.length; i < l; ++i) {
    cost += limitQueryCost(queries[i], max);
    if (cost > max) throw EXPENSIVE_QUERY_ERROR;
  }
  return cost;
};

run({
  maxCost: 10000,
  router,
  queries: [
    [
      'hosts',
      {online: true},
      _.range(10),
      [
        'id',
        ['name', ['first', 'last']],
        ['owner', ['id', 'name']]
      ]
    ],
    ['user', ['id', 'name']]
  ],
  context: {userId: 1}
})
  .then(pathValues => {
    console.log(pathValues);
    applyPathValues(data, pathValues);
    console.log(data);
    return run({
      maxCost: 10000,
      router,
      queries: [
        ['user!', {name: 'Silly', id: 'bunny'}]
      ],
      context: {userId: 2}
    }).then(pathValues => {
      console.log(pathValues);
      applyPathValues(data, pathValues);
      console.log(data);
    });
  })
  .catch(er => { console.error(er); });

const data = {
  hosts: {
    0: {$ref: ['hostsById', '1-Larry']},
    1: {$ref: ['hostsById', '1-Curly']},
    2: {$ref: ['hostsById', '1-Mo']},
    '[["foo","bar"]]': {
      0: {$ref: ['hostsById', '1-Curly']}
    }
  },
  hostsById: {
    '1-Larry': {
      id: '1-Larry',
      name: 'Larry',
      owner: {$ref: ['usersById', 1]}
    },
    '1-Curly': {
      id: '1-Curly',
      name: 'Curly',
      owner: {$ref: ['you']}
    },
    '1-Mo': {
      id: '1-Mo',
      name: 'Mo',
      owner: {$ref: ['usersById', 1]}
    }
  },
  user: {$ref: ['usersById', 1]},
  you: {$ref: ['usersById', 1]},
  usersById: {
    1: {
      id: 1,
      name: 'THE NEWBY',
      hosts: [
        {$ref: ['hostsById', '1-Larry']},
        {$ref: ['hostsById', '1-Curly']},
        {$ref: ['hostsById', '1-Mo']}
      ]
    }
  }
};

import toKey from '../shared/utils/to-key';

const resolveRefs = (data, obj, maxDepth, depth = 0) => {
  if (!isObject(obj)) return obj;

  const iterator = _.partial(resolveRefs, data, _, maxDepth, depth);
  if (isArray(obj)) return _.map(obj, iterator);

  const {$error, $ref} = obj;
  if ($error) return _.extend(new Error(), $error);
  if ($ref) return get(data, $ref, maxDepth, depth + 1);

  return _.mapObject(obj, iterator);
};

const walk = (data, path) => {
  let val = data;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    if (val = val[toKey(path[i])]) {
      const {$error, $ref} = val;
      if ($error) return _.extend(new Error(), $error);
      if ($ref) val = walk(data, $ref);
    }
  }
  return val;
};

const get = (data, path, maxDepth = 3, depth = 0) => {
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

const set = (data, path, value) => {
  path = resolvePath(data, path.slice(0, -1)).concat(path.slice(-1));
  let cursor = data;
  for (var i = 0, l = path.length; i < l; ++i) {
    const key = toKey(path[i]);
    if (i === l - 1) return cursor[key] = value;
    if (cursor[key] == null) cursor[key] = {};
    cursor = cursor[key];
  }
};

const applyPathValues = (data, pathValues) => {
  for (let i = 0, l = pathValues.length; i < l; ++i) {
    const {path, value} = pathValues[i];
    set(data, path, value);
  }
};

// const merge = (a, b) => {
//   if (!isPojo(a) || !isPojo(b)) return b;
//   for (let key in b) a[key] = merge(a[key], b[key]);
//   return a;
// };
