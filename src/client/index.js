import './utils/set-global';
import './utils/livereload';
// import './utils/inject-network-layer';
// import React from 'react';
// import {render} from 'react-dom';
// import {RelayRouter as Router} from 'react-router-relay';
// import {hashHistory as history} from 'react-router';
// import routes from './routes';
// import '../shared/peer';
//
// render(<Router {...{history, routes}} />, document.getElementById('main'));

import model from './utils/model';

window.model = model;
import live from './utils/live';

live.send('sign-in', 'c@sey.me', (er) => {
  console.log(er || 'Email sent');
});
