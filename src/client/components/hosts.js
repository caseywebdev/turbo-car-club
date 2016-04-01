import _ from 'underscore';
import {Component} from 'pave-react';
import Host from './host';
import live from '../utils/live';
import React from 'react';
import store from '../utils/store';

export default class extends Component {
  store = store;

  getPaveWatchQuery() {
    return ['hosts'];
  }

  getPaveQuery() {
    return ['hosts', _.range(10), ['id', 'name', ['owner', ['id', 'name']]]];
  }

  getPaveState() {
    return {
      hosts: store.get(['hosts'])
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this.reloadPave = ::this.reloadPave;
    live
      .send('sub', 'host-added').on('host-added', this.reloadPave)
      .send('sub', 'host-removed').on('host-removed', this.reloadPave);
  }

  componentWillUnmount() {
    super.componentWillMount();
    live.off(this.reloadPave);
  }

  render() {
    const {error, hosts = [], isLoading} = this.state;
    return (
      <div>
        <div>Hosts{isLoading ? ' (Loading...)' : ''}</div>
        {error ? error.toString() : null}
        {_.map(hosts, (host, key) => <Host {...{host, key}} />)}
      </div>
    );
  }
}
