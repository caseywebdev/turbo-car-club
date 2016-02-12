import _ from 'underscore';
import createContainer from '../utils/create-container';
import Host from './host';
import React from 'react';

const renderHost = (host, key) => <Host {...{host, key}} />;

let tid;

export default createContainer(
  ({error, isLoading, hosts, setParams, params: {to}}) =>
    clearTimeout(tid) ||
    (tid = setTimeout(() => setParams({to: ++to % 4}), 1000)) &&
    <div>
      <div>Hosts</div>
      {error ? error.toString() : null}
      {_.map(hosts, renderHost).slice(0, to)}
      {isLoading ? 'Loading...' : null}
    </div>,
  {
    defaultParams: {
      to: 0
    },

    query: ({to}) => [
      'hosts',
      _.range(to),
      Host.fragments().host
    ],

    props: () => ({
      hosts: ['hosts']
    })
  }
);
