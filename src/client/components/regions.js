import _ from 'underscore';
import PaveSubscription from 'pave-subscription';
import React, {Component} from 'react';
import store from '../utils/store';

const renderRegion = region =>
  <pre key={region.id}>{JSON.stringify(region)}</pre>;

export default class extends Component {
  componentWillMount() {
    this.sub = new PaveSubscription({
      store,
      query: [
        'regionsById',
        _.keys(store.get(['regionsById'])),
        ['id', 'url', 'rtt']
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
    const {error, isLoading, regions} = this.state;
    return (
      <div>
        {
          isLoading ? 'Loading...' :
          error ? error.toString() :
          _.map(regions, renderRegion)
        }
      </div>
    );
  }
}
