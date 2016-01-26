// = link src/signal/data/schema.json

import cx from '../utils/cx';
import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';
import Relay from 'react-relay';
// import Peer from '../../shared/peer';
// import live from '../utils/live';

// live.on('signal', ({data}) => window.host.signal(data));
// const setHost = id => {
//   window.host = new Peer()
//     .on('signal', data => live.send('signal', {id, data}))
//     .on('u', t => console.log(Date.now(), t))
//     .on('close', () => setHost(id))
//     .call();
// };

const {host: cxl} = cx;

export default Relay.createContainer(
  ({host: {owner, name}}) =>
    <div className={cxl.root}>
      <div className={cxl.name}>{name}</div>
      <div className={cxl.owner}>{getUserDisplayName(owner)}</div>
    </div>,
  {
    fragments: {
      host: () => Relay.QL`
        fragment on Host {
          name,
          owner {
            id,
            name
          }
        }
      `
    }
  }
);
