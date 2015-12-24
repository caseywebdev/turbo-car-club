import React, {Component} from 'react';
import {Link} from 'react-router';

// this.live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

export default class extends Component {
  render() {
    return (
      <div>
        <div>Hello World!!!!</div>
        <Link to='/foo'>Foo</Link>
        <Link to='/'>Root</Link>
      </div>
    );
  }
}
