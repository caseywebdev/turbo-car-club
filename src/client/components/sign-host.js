// = link src/signal/data/schema.json

import React from 'react';
import Relay from 'react-relay';

export default Relay.createContainer(
  ({signedHost}) =>
    <pre>{JSON.stringify(signedHost, null, 2)}</pre>,
  {
    fragments: {
      signedHost: () => Relay.QL`
        fragment on Host {
          name,
          key,
          owner {
            id,
            name
          }
        }
      `
    }
  }
);
