import _ from 'underscore';
import Host from './host';
import live from '../utils/live';
import PaveSubscription from 'pave-subscription';
import React, {Component} from 'react';
import store from '../utils/store';

export default class extends Component {
  componentWillMount() {
    this.sub = new PaveSubscription({
      store,
      query: ['hosts', _.range(10), ['id', 'name', ['owner', ['id', 'name']]]],
      onChange: ({error, isLoading}) =>
        this.setState({error, isLoading, hosts: store.get(['hosts'])})
    });
    this.reload = ::this.sub.reload;
    live
      .send('sub', 'host-added').on('host-added', this.reload)
      .send('sub', 'host-removed').on('host-removed', this.reload);
  }

  componentWillUnmount() {
    live.off(this.reload);
    this.sub.destroy();
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
