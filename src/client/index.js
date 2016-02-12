import './utils/set-global';
import './utils/livereload';
import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory as history} from 'react-router';
import routes from './utils/routes';
//
render(<Router {...{history, routes}} />, document.getElementById('main'));

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

// store.run({
//   allOrNothing: true,
//   query: ['verify!', {token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbEFkZHJlc3MiOiJjQHNleS5tZSIsInNpZ25lZEluQXQiOm51bGwsInNvY2tldElkIjoiNjM5NzdjYWItYzQ3Yy00ZmZiLTg0YTctMjdkY2Q0YzVlOTIzIiwiaWF0IjoxNDU1MjMxMTc2LCJzdWIiOiJ2ZXJpZnkifQ.zS4ZczoNeD6374zRLfaxS4RMR5_Q2iCXXnyzWqEtlIY'}]
// }).then(::console.log).catch(::console.error);
// store.run({
//   query: ['sign-in!', {emailAddress: 'c@sey.me'}]
// }).then(::console.log);
// run({
//   router,
//   db,
//   query: ['auth!', {token: get(db, ['authToken'])}]
// }).then(::console.log);
//
// store.run({
//   query: [[
//     [
//       'hosts',
//       [
//         'length',
//         [
//           _.range(10),
//           [
//             'id',
//             'name',
//             ['owner', ['id', 'name']]
//           ]
//         ]
//       ]
//     ]
//     // ['user', ['id', 'name']]
//   ]]
// })
//   .then(() => {
//     console.log(store.cache);
//     console.log(store.get(['hosts', 0]));
//   })
//   .catch(::console.error);
