import Meta from './meta';
import Qs from 'qs';
import React, {Component} from 'react';
import store from '../utils/store';

export default class extends Component {
  componentDidMount() {
    const {location: {search}, history: {replace}} = this.props;
    const {token} = Qs.parse(search);
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
          Verifying...
        </div>
      </Meta>
    );
  }
}
