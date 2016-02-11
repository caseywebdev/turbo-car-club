import _ from 'underscore';
import createContainer from '../utils/create-container';
import Host from './host';
import React from 'react';

const renderHost = (host, key) => <Host {...{host, key}} />;

export default createContainer(
  ({isLoading, hosts}) =>
    <div>
      <div>Hosts</div>
      {_.map(_.compact(hosts), renderHost)}
      {isLoading ? 'Loading...' : null}
    </div>,
  {
    defaultParams: {
      range: _.range(10)
    },

    queries: ({range}) => [
      'hosts',
      {foo: 'bar'},
      [
        'length',
        [range, Host.fragments().host]
      ]
    ],

    remap: ({range}) => ({
      hosts: get(db, ['hosts', {foo: 'bar'}])
    })
  }
);
