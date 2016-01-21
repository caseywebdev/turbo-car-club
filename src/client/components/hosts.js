// = link src/signal/data/schema.json

import _ from 'underscore';
import Host from './host';
import React from 'react';
import Relay from 'react-relay';

const renderHost = (host, key) => <Host {...{host, key}} />;

export default Relay.createContainer(
  ({hosts}) =>
    <table>
      <thead><tr><th>Owner</th><th>Region</th><th>Name</th></tr></thead>
      <tbody>{_.map(hosts, renderHost)}</tbody>
    </table>,
  {
    fragments: {
      hosts: () => Relay.QL`
        fragment on Host @relay(plural: true) {
          ${Host.getFragment('host')}
        }
      `
    }
  }
);
