import _ from 'underscore';
import createContainer from '../utils/create-container';
import live from '../utils/live';
import Host from './host';
import React, {Component} from 'react';

const renderHost = (host, key) => <Host {...{host, key}} />;

export default createContainer(
  class extends Component {
    componentWillMount() {
      const {forceRun} = this.props;
      live
        .on('falcomlay:host-added!', forceRun)
        .on('falcomlay:host-removed!', forceRun);
    }

    componentWillUnmount() {
      const {forceRun} = this.props;
      live
        .off('falcomlay:host-added!', forceRun)
        .off('falcomlay:host-removed!', forceRun);
    }

    render() {
      const {error, isLoading, hosts} = this.props;
      return (
        <div>
          <div>Hosts</div>
          {error ? error.toString() : null}
          {_.map(hosts, renderHost)}
          {isLoading ? 'Loading...' : null}
        </div>
      );
    }
  },
  {
    query: () => [
      'hosts',
      [
        'length',
        [_.range(10), Host.fragments().host]
      ]
    ],

    paths: () => ({
      hosts: ['hosts']
    })
  }
);
