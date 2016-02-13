import _ from 'underscore';
import createContainer from '../utils/create-container';
import Host from './host';
import React from 'react';

const renderHost = (host, key) => <Host {...{host, key}} />;

export default createContainer(
  ({error, isLoading, hosts}) =>
    <div>
      <div>Hosts</div>
      {error ? error.toString() : null}
      {_.map(hosts, renderHost)}
      {isLoading ? 'Loading...' : null}
    </div>,
  {
    query: () => [
      'hosts',
      [
        'length',
        [_.range(10), Host.fragments().host]
      ]
    ],

    props: () => ({
      hosts: ['hosts']
    })
  }
);
