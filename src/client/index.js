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

const queries = [
  [
    'hosts',
    {online: true},
    {$range: {first: 10}},
    [
      'id',
      ['name', ['first', 'last']],
      ['owner', ['id', ['name', ['first', 'last']]]]
    ]
  ],
  ['users', 'name', ['first', 'last']]
];

import _ from 'underscore';

const _flattenPath = (path, prefix = []) => {
  if (!path.length) return [prefix];

  const [first, ...rest] = path;

  if (!_.isArray(first)) return _flattenPath(rest, [...prefix, first]);

  return _.reduce(first, (paths, path) => [
    ...paths,
    ..._flattenPath([
      ...prefix,
      ...(_.isArray(path) ? path : [path]),
      ...rest
    ])
  ], []);
};

const flattenPath = path => _flattenPath(path);

const flattenPaths = queries =>
  _.flatten(_.map(queries, flattenPath), true);

const routes = {
  'hosts.$params.$range':
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
};

const stringToPath = path => _.invoke(path.split('.'), 'split', '|');
const pathToString = path => path.join('.');

const querySegmentToRouteSegment = segment =>
  !_.isObject(segment) ? [segment, '$key'] :
  _.has(segment, '$range') ? '$range' :
  '$params';

const queryToRoutes = query => {
  const {length} = query;
  const flattened = flattenPath(_.map(query, querySegmentToRouteSegment));
  return _.unique(_.reduce(_.range(length), (routes, n) => [
    ...routes,
    ..._.map(flattened, route => pathToString(route.slice(0, length - n)))
  ], [])).concat('$fallback');
};

const addRoute = (router, fn, path) =>
  _.reduce(
    flattenPath(stringToPath(path)),
    (router, path) => ({...router, [pathToString(path)]: fn}),
    router
  );

const ROUTE_NOT_FOUND_ERROR = new Error('No matching route found');
const DEFAULT_FALLBACK = () => { throw ROUTE_NOT_FOUND_ERROR; };

const createRouter = routes =>
  _.reduce(_.extend({$fallback: DEFAULT_FALLBACK}, routes, addRoute, {}));

const router = createRouter(routes);

const run = (router, queries, context) => {
  const runMap = _.reduce(flattenPaths(queries), (runMap, query) => {
    const route = _.find(queryToRoutes(query), _.partial(_.has, router));
    const arity = route === '$fallback' ? Infinity : stringToPath(route).length;
    const unfulfilled = query.length > arity;
    const fn = router[route];
    const runFn = map.get(fn);
    if (!runFn) {
      map.set(fn, {
        context,
        arity,
        queries: [],
        unfulfilled: [],
        ..._.times(arity, n => [])
      });
    }
    if (!map.has(fn))
  }, new Map());
  return Promise.resolve(_.reduce(queries, (map, {query, fn}) => {
    if (!map.has(fn)) map.set(fn, {context, queries: []});
    map.get(fn).queries.push(query);
    const remainder =
    _.each(query, (segment, i) => {
      if (!map.get(fn)[i]) map.get(fn)[i] = [];
      const existing = _.find(map.get(fn)[i], _.partial(_.isEqual, segment));
      if (!existing) map.get(fn)[i].push(segment);
    });
    return map;
  }, new Map()));
  // Promise.all(_.map(flattenPaths(queries), query => {
  //   const route = _.find(queryToRoutes(query), _.partial(_.has, routes));
  //   return Promise.resolve({context, query})
  //     .then(routes[route] || fallback)
  //     .catch($error => ({path: query, value: {$error}}));
  // }));
};

run(router, queries).then(console.log.bind(console));
