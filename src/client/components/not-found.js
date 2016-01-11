import Meta from './meta';
import React, {Component} from 'react';
import {Link} from 'react-router';

export default class extends Component {
  render() {
    return (
      <Meta title='Not Found'>
        <div>
          <div>Not Found!</div>
          <Link to='/'>Go Home</Link>
        </div>
      </Meta>
    );
  }
}
