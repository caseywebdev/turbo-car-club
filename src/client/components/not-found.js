import React, {Component} from 'react';
import {Link} from 'react-router';

export default class extends Component {
  render() {
    return (
      <div>
        Not Found! <Link to='/'>Go Home</Link>
      </div>
    );
  }
}
