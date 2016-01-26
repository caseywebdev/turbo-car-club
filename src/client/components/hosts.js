// = link src/signal/data/schema.json

import _ from 'underscore';
import Host from './host';
import React from 'react';
import Relay from 'react-relay';

const renderHost = (host, key) => <Host {...{host, key}} />;

export default Relay.createContainer(
  ({hosts}) =>
    <div>
      <div>Hosts</div>
      {_.map(hosts, renderHost)}
    </div>,
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
