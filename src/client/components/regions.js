import _ from 'underscore';
import PaveSubscription from 'pave-subscription';
import React, {Component} from 'react';
import store from '../utils/store';

const renderRegion = ({id, ping}) =>
  <div key={id}>
    {id} {ping == null ? '...' : Math.floor(ping * 1000)} ping
  </div>;

export default class extends Component {
  componentWillMount() {
    this.sub = new PaveSubscription({
      store,
      query: [
        'regionsById',
        _.keys(store.get(['regionsById'])),
        ['id', 'url', 'ping']
      ],
      onChange: sub =>
        this.setState({
          error: sub.error,
          isLoading: sub.isLoading,
          regions: store.get(['regions'])
        })
    });
  }

  componentWillUnmount() {
    this.sub.destroy();
  }

  render() {
    const {error, regions} = this.state;
    return <div>{error ? error.toString() : _.map(regions, renderRegion)}</div>;
  }
}
