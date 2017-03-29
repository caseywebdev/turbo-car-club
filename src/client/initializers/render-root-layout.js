import {render} from 'react-dom';
import React from 'react';
import RootLayout from '../components/layouts/root';

render(<RootLayout />, document.getElementById('main'));

// import Peer from '../../shared/peer';

// live.on('signal', ({data}) => window.host.signal(data));
// const setHost = id => {
//   window.host = new Peer()
//     .on('signal', data => live.send('signal', {id, data}))
//     .on('u', t => console.log(Date.now(), t))
//     .on('close', () => setHost(id))
//     .call();
// };
