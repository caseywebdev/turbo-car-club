// = link src/signal/data/schema.json

import React from 'react';
import Relay from 'react-relay';
import Hosts from './hosts';
// import live from '../utils/live';
//
// live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

export default Relay.createContainer(
  ({viewer: {availableHosts}}) => <Hosts hosts={availableHosts} />,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on User {
          availableHosts {
            ${Hosts.getFragment('hosts')}
          }
        }
      `
    }
  }
);
