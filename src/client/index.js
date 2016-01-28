import './utils/set-global';
import './utils/livereload';
// import React from 'react';
// import {render} from 'react-dom';
// import {Router, hashHistory as history} from 'react-router';
// import routes from './routes';
//
// render(<Router {...{history, routes}} />, document.getElementById('main'));

import model from './utils/model';
window.model = model;
// import live from './utils/live';
//
// live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

import resolvePath from './utils/resolve-path';

model.get(...resolvePath([
  'hosts',
  [{from: 0, to: 9}, 'length'],
  [
    'id',
    'name',
    {$type: 'join', value: {owner: [['id', 'name']]}}
  ]
])).then(console.log.bind(console));
