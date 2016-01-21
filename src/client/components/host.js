// = link src/signal/data/schema.json

import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';
import Relay from 'react-relay';

export default Relay.createContainer(
  ({host: {user, region, name}}) =>
    <tr>
      <td>{getUserDisplayName(user)}</td>
      <td>{region}</td>
      <td>{name}</td>
    </tr>,
  {
    fragments: {
      host: () => Relay.QL`
        fragment on Host {
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
