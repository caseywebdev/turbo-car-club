// = link src/signal/data/schema.json

import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';
import Relay from 'react-relay';
import Peer from '../../shared/peer';
import live from '../utils/live';

live.on('signal', ({data}) => window.host.signal(data));
const setHost = id => {
  window.host = new Peer()
    .on('signal', data => live.send('signal', {id, data}))
    .on('u', t => console.log(Date.now(), t))
    .on('close', () => setHost(id))
    .call();
};

export default Relay.createContainer(
  ({host: {id, user, region, name}}) =>
    setHost(id) ||
    <tr>
      <td>{id}</td>
      <td>{getUserDisplayName(user)}</td>
      <td>{region}</td>
      <td>{name}</td>
    </tr>,
  {
    fragments: {
      host: () => Relay.QL`
        fragment on Host {
          id,
          user {
            id,
            name
          },
          name,
          region
        }
      `
    }
  }
);
