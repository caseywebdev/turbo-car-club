import db from '../utils/db';
import Meta from './meta';
import React, {Component, PropTypes} from 'react';
import live from '../utils/live';

export default class extends Component {
  static contextTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {location: {query: {token}}, router: {replace}} = this.context;
    if (!token) return replace('/');
    live.send('verify', token, (er, auth) => {
      if (er) return console.error(er);
      db.set('auth', auth);
      console.log('verify authorized!');
      replace('/');
    });
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
