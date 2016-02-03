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

const _flattenPath = (path, prefix = []) => {
  let i = 0;
  const l = path.length;
  while (i < l && !_.isArray(path[i])) ++i;

  if (i === l) return [prefix.concat(path)];

  const paths = [];
  prefix = prefix.concat(path.slice(0, i));
  const first = path[i];
  const rest = path.slice(i + 1);
  for (let i = 0, l = first.length; i < l; ++i) {
    paths.push.apply(paths, _flattenPath([].concat(first[i], rest), prefix));
  }
  return paths;
};

const flattenPath = path => _flattenPath(path);

const flattenPaths = paths => {
  const flattened = [];
  for (let i = 0, l = paths.length; i < l; ++i) {
    flattened.push.apply(flattened, flattenPath(paths[i]));
  }
  return flattened;
};

const stringToPath = path => _.invoke(path.split('.'), 'split', '|');

const pathToString = path => path.join('.');

const querySegmentToRouteSegment = segment =>
  _.isObject(segment) ? '$params' : [segment, '$key'];

const queryToRoutes = query => {
  const {length} = query;
  const flattened = flattenPath(_.map(query, querySegmentToRouteSegment));
  return _.unique(_.reduce(_.range(length), (routes, n) => routes.concat(
    _.map(flattened, route => pathToString(route.slice(0, length - n)))
  ), [])).concat('$fallback');
};

const addRoute = (router, fn, path) =>
  _.reduce(
    flattenPath(stringToPath(path)),
    (router, path) => ({...router, [pathToString(path)]: fn}),
    router
  );

const ROUTE_NOT_FOUND_ERROR = new Error('No matching route found');
const EXPENSIVE_QUERY_ERROR = new Error('Query is too expensive');
const DEFAULT_FALLBACK = () => { throw ROUTE_NOT_FOUND_ERROR; };

const createRouter = routes =>
  _.reduce(_.extend({$fallback: DEFAULT_FALLBACK}, routes), addRoute, {});

const run = ({maxCost, router, queries, context}) =>
  Promise
    .resolve()
    .then(() => limitQueriesCost(queries, maxCost))
    .then(() =>
      _.reduce(flattenPaths(queries), ({runs, queries}, query) => {
        const route = _.find(queryToRoutes(query), _.partial(_.has, router));
        const routePath = stringToPath(route);
        const arity = route === '$fallback' ? 0 : routePath.length;
        if (arity && query.length > arity) queries.push(query);
        const fn = router[route];
        let run = _.find(runs, {fn});
        if (!run) runs.push(run = {fn, args: {context, queries: []}});
        const args = run.args;
        args.queries.push(query);
        _.times(arity, n => {
          if (!args[n]) args[n] = [];
          const arg = query[n];
          args[n] = _.unique(_.sortBy(args[n].concat(
            _.any(args[n], _.partial(_.isEqual, arg)) ? [] : arg
          )), true);
        });
        return {runs, queries};
      }, {runs: [], queries: []})
    );

const router = createRouter({
  'hosts.$params.$key':
    ({1: params}) => ({path: ['hosts', params, 0], value: 'Foo!'}),
  'hostsById.$key.id|name|owner':
    ({context, 1: ids, 2: keys}) =>
      context && ids && keys,
  user:
    ({context: {userId}}) => {
      if (!userId) throw new Error('Auth required');
      return {path: ['user'], value: {$ref: ['usersById', userId]}};
    },
  'usersByid.$key.id|name|emailAddress':
    ({context, 1: ids, 2: keys}) =>
      context && ids && keys
});

const queries = [
  [
    'hosts',
    {online: true},
    _.range(100),
    [
      'id',
      ['name', ['first', 'last']],
      ['owner', ['id', 'name']]
    ]
  ],
  ['user', ['id', 'name']]
];

const limitQueryCost = (path, max, precost = 0) => {
  let i = 0;
  const l = path.length;
  while (i < l && !_.isArray(path[i])) ++i;

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
  queries,
  context: {userId: 1}
})
  .then(console.log.bind(console))
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

import stringifyParams from '../shared/utils/stringify-params';

const resolveRefs = (obj, maxDepth, depth = 0) =>
  !_.isObject(obj) ? obj :
  _.isArray(obj) ? _.map(obj, _.partial(resolveRefs, _, maxDepth, depth)) :
  obj.$ref ? get(obj.$ref, maxDepth, depth + 1) :
  _.mapObject(obj, _.partial(resolveRefs, _, maxDepth, depth));

const walk = (data, path) => {
  let val = data;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    val = val[path[i]];
    if (val && val.$ref) val = walk(data, val.$ref);
  }
  return val;
};

const get = (path, maxDepth = 3, depth = 0) => {
  path = _.map(path, stringifyParams);
  if (depth > maxDepth) return {$ref: path};
  return resolveRefs(walk(data, path), maxDepth, depth);
};

// const getBranch = path => {
//   const root = {};
//   for (let i = 0, l = path.length, cursor = root; i < l; ++i) {
//     const val = getValue(path.slice(0, i + 1));
//     if (val == null) break;
//     cursor = cursor[path[i]] = i < l - 1 ? {} : val;
//   }
//   return root;
// };
//
// const get = queries => {
//   const obj = {};
//   const paths = flattenPaths(stringifyParams(queries));
//   for (let i = 0, l = paths.length; i < l; ++i) merge(obj, getBranch(paths[i]));
//   return obj;
// };
//
// const merge = (a, b) => {
//   if (_.isObject(a) && _.isObject(b)) {
//     for (let key in b) {
//       if (key in a) merge(a[key], b[key]);
//       else a[key] = b[key];
//     }
//   }
//   return a;
// };

const followPath = (data, path) => {
  let val = data;
  for (let i = 0, l = path.length; i < l && val != null; ++i) {
    val = val[path[i]];
    if (val && val.$ref) {
      return followPath(data, val.$ref.concat(path.slice(i + 1)));
    }
  }
  return path;
};

console.log(followPath(data, ['hosts', 0, 'id']));

const set = (data, path, value) => {
  path = followPath(data, _.map(path, stringifyParams));
  let cursor = data;
  for (var i = 0, l = path.length; i < l; ++i) {
    const key = path[i];
    if (i === l - 1) return cursor[key] = value;
    if (cursor[key] == null) cursor[key] = {};
    cursor = cursor[key];
  }
};

set(data, ['foo', 'bar'], {$ref: ['you']});
set(data, ['foo', 'baz'], {$ref: ['you']});
set(data, ['foo', 'bar', 'name'], 'Casey');
console.log(get(['foo']));
console.log(data);

console.log(get(['hosts', {foo: 'bar'}, 0]));
