import _ from 'underscore';
import live from '../utils/live';
import Host from './host';
import React from 'react';
import {Component} from 'pave-react';
import ReactList from 'react-list';

import store from '../utils/store';

export default class extends Component {
  store = store;

  getPaveQuery() {
    const {from, size} = this.state;
    return [
      'hosts',
      [
        'length',
        [_.range(from, from + size), Host.fragments().host]
      ]
    ];
  }

  getPaveState() {
    return {
      hosts: store.get(['hosts'])
    };
  }

  state = {
    from: 0,
    size: 100
  };

  componentWillMount() {
    super.componentWillMount();
    live
      .send('sub', 'host-added').on('host-added', this.update)
      .send('sub', 'host-removed').on('host-removed', this.update);
  }

  componentWillUnmount() {
    super.componentWillMount();
    live.off(this.update);
  }

  update = () => {
    const {hosts, from, size} = this.state;
    if (!hosts) return;
    for (let index in hosts) {
      index = parseInt(index);
      if (isNaN(index)) continue;
      if (index < from || index > from + size) {
        store.set(['hosts', index], undefined);
      }
    }
    this.updatePave({force: true});
  }

  updateRange = _.debounce(() => {
    const {from, size} = this.list.state;
    this.setState({from, size});
  }, 100);

  renderHost = (index, key) => {
    let host = this.state.hosts[index];
    if (!host) {
      this.updateRange();
      host = {name: 'Loading...', owner: {id: 'Loading...'}};
    }
    return <Host {...{key, host}} />;
  }

  render() {
    const {error, hosts, isLoading} = this.state;
    return (
      <div>
        <div>Hosts{isLoading ? ' (Loading...)' : ''}</div>
        {error ? error.toString() : null}
        <ReactList
          itemRenderer={this.renderHost}
          length={hosts && hosts.length || 0}
          ref={c => this.list = c}
          type='uniform'
          updateForHosts={hosts}
        />
      </div>
    );
  }
}
