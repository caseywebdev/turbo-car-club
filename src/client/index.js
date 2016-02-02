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
  if (!path.length) return [prefix];

  const [first, ...rest] = path;

  if (!_.isArray(first)) return _flattenPath(rest, prefix.concat(first));

  return _.reduce(
    first,
    (paths, path) => paths.concat(_flattenPath(prefix.concat(path, rest))),
    []
  );
};

const flattenPath = path => _flattenPath(path);

const flattenPaths = queries => _.flatten(_.map(queries, flattenPath), true);

const stringToPath = path => _.invoke(path.split('.'), 'split', '|');

const pathToString = path => path.join('.');

const querySegmentToRouteSegment = segment =>
  _.isNumber(segment) ? [segment, '$key', '$range'] :
  !_.isObject(segment) ? [segment, '$key'] :
  _.has(segment, '$range') ? '$range' :
  '$params';

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

const run = ({maxCost, router, queries, context}) => {
  limitQueriesCost(queries, maxCost);
  const runs = _.reduce(flattenPaths(queries), ({runs, queries}, query) => {
    const route = _.find(queryToRoutes(query), _.partial(_.has, router));
    const routePath = stringToPath(route);
    const arity = route === '$fallback' ? 0 : routePath.length;
    if (arity && query.length > arity) queries.push(query);
    const fn = router[route];
    let run = _.find(runs, {fn});
    if (!run) runs.push(run = {fn, args: {context, queries: []}});
    run.args.queries.push(query);
    _.times(arity, n => {
      run.args[n] = (run.args[n] || []).concat(
        _.any(run.args[n], _.partial(_.isEqual, query[n])) ? [] : query[n]
      );
    });
    return {runs, queries};
  }, {runs: [], queries: []});
  return Promise.resolve(runs);
};

const router = createRouter({
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
});

const queries = [
  [
    'hosts',
    {online: true},
    {$range: {from: 0, size: 10}},
    {$range: {from: 0, size: 10}},
    [
      'id',
      ['name', ['first', 'last']],
      ['owner', ['id', 'name']]
    ]
  ],
  ['user', ['id', 'name']]
];

const limitQueryCost = (query, max, precost = 0) => {
  if (!query.length) return precost;

  const [first, ...rest] = query;

  const cost =
    _.isArray(first) ?
    _.reduce(first, (cost, path) =>
      cost + limitQueryCost([].concat(path, rest), max, precost)
    , 0) :
    limitQueryCost(rest, max, precost + 1);

  if (cost > max) throw EXPENSIVE_QUERY_ERROR;

  return cost;
};

const limitQueriesCost = (queries, max) =>
  _.reduce(queries, (cost, query) => {
    cost += limitQueryCost(query, max);

    if (cost > max) throw EXPENSIVE_QUERY_ERROR;

    return cost;
  }, 0);

run({
  maxCost: 100,
  router,
  queries,
  context: {userId: 1}
}).then(console.log.bind(console));
