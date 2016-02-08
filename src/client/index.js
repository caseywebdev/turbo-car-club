import './utils/set-global';
import './utils/livereload';
// import React from 'react';
// import {render} from 'react-dom';
// import {Router, hashHistory as history} from 'react-router';
// import router from './routes';
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
import {
  createRouter,
  run,
  applyChange
} from './falcomlay';

const ROUTE_NOT_FOUND_ERROR = new Error('No matching route found');

const router = createRouter({
  'hosts.$params.$key':
    ({1: params, 2: indices}) =>
      _.map(params, params =>
        _.map(indices, index => ({
          path: ['hosts', params, index],
          value: index === 'length' ? 10 : {$ref: ['hostsById', '1-Larry']}
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
  },
  '*': () => { throw ROUTE_NOT_FOUND_ERROR; }
});
const start = Date.now();
run({
  router,
  query: [[
    [
      'hosts',
      {online: true},
      [
        'length',
        [
          _.range(10),
          [
            'id',
            ['name', ['first', 'last']],
            ['owner', ['id', 'name']]
          ]
        ]
      ]
    ],
    ['user', ['id', 'name']]
  ]],
  context: {userId: 1}
})
  .then(change => {
    applyChange(db, change);
    return run({
      router,
      query: ['user!', {name: 'Silly'}],
      context: {userId: 2}
    }).then(change => {
      applyChange(db, change);
      console.log(Date.now() - start);
    });
  })
  .catch(::console.error);

const db = {};
