import './utils/set-global';
import './utils/livereload';
// import React from 'react';
// import {render} from 'react-dom';
// import {Router, hashHistory as history} from 'react-router';
// import routes from './utils/routes';
//
// render(<Router {...{history, routes}} />, document.getElementById('main'));

import live from './utils/live';

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
  // applyChange,
  get
} from '../shared/utils/falcomlay';

import db from './utils/db';

const router = createRouter({
  '*': ({paths}) =>
    new Promise((resolve, reject) =>
      live.send('falcomlay', {query: [paths]}, (er, change) => {
        if (er) return reject(er);
        resolve(change);
      })
    )
});

run({
  router,
  query: ['sign-in!', {emailAddress: 'c@sey.me'}]
}).then(::console.log);
run({
  router,
  db,
  query: ['auth!', {token: get(db, ['auth'])}]
}).then(::console.log);

run({
  router,
  db,
  query: [[
    [
      'hosts',
      [
        'length',
        [
          _.range(10),
          [
            'id',
            'name',
            ['owner', ['id', 'name']]
          ]
        ]
      ]
    ],
    ['user', ['id', 'name']]
  ]]
})
  .then(() => {
    console.log(db);
  })
  .catch(::console.error);
