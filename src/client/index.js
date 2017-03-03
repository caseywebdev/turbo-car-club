import './utils/set-global';
import './utils/livereload';
import 'whatwg-fetch';
import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory as history} from 'react-router';
import routes from './routes';

render(<Router {...{history, routes}} />, document.getElementById('main'));

// import Peer from '../../shared/peer';

// live.on('signal', ({data}) => window.host.signal(data));
// const setHost = id => {
//   window.host = new Peer()
//     .on('signal', data => live.send('signal', {id, data}))
//     .on('u', t => console.log(Date.now(), t))
//     .on('close', () => setHost(id))
//     .call();
// };
