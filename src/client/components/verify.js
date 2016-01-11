import db from '../utils/db';
import Meta from './meta';
import React, {Component} from 'react';
import live from '../utils/live';

export default class extends Component {
  componentDidMount() {
    const {location: {query: {key}}, history: {replaceState}} = this.props;
    if (!key) return replaceState(null, '/');
    live.send('verify', key, (er, auth) => {
      if (er) return console.error(er);
      db.set('auth', auth);
      console.log('verify authorized!');
      replaceState(null, '/');
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
