import Meta from './meta';
import React, {Component} from 'react';
import store from '../utils/store';

export default class extends Component {
  componentDidMount() {
    const {location: {query: {token}}, router: {replace}} = this.props;
    if (!token) return replace('/');
    store
      .run({query: ['verify!', {token}]})
      .then(() => replace('/'))
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
