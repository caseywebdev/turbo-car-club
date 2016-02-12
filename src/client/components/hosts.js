import _ from 'underscore';
import createContainer from '../utils/create-container';
import Host from './host';
import React from 'react';

const renderHost = (host, key) => <Host {...{host, key}} />;

export default createContainer(
  ({isLoading, hosts}) =>
    <div>
      <div>Hosts</div>
      {_.map(hosts, renderHost)}
      {isLoading ? 'Loading...' : null}
    </div>,
  {
    defaultParams: {
      range: _.range(10)
    },

    queries: ({range}) => [
      'hosts',
      {range},
      [
        'length',
        [range, Host.fragments().host]
      ]
    ],

    props: () => ({
      hosts: ['hosts']
    })
  }
);
