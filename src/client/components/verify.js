import disk from '../utils/disk';
import Meta from './meta';
import React, {Component, PropTypes} from 'react';
import store from '../utils/store';

export default class extends Component {
  static contextTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {location: {query: {token}}, router: {replace}} = this.context;
    if (!token) return replace('/');
    store
      .run({query: ['verify!', {token}], allOrNothing: true})
      .then(() => {
        disk.set('authToken', store.get(['authToken']));
        replace('/');
      })
      .catch(er => console.error(er));
  }

  render() {
    return (
      <Meta title='Verify'>
        <div>
          Do verify stuff
        </div>
      </Meta>
    );
  }
}
