import React, {Component} from 'react';
import {Link} from 'react-router';

// if (props.verify) {
//   this.live.send('verify', props.verify, (er, auth) => {
//     if (er) return console.error(er);
//     db.set('auth', auth);
//     console.log('verify authorized!');
//   });
// }
// this.live.send('sign-in', 'c@sey.me', (er) => {
//   console.log(er || 'Email sent');
// });

export default class extends Component {
  getTitle() {
    return 'Home';
  }

  componentDidMount() {
    console.log('index mount');
  }

  componentDidUpdate() {
    console.log('index update');
  }

  render() {
    return (
      <div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <div>Hello World!!!</div>
        <Link to='/foo'>Foo</Link>
        <Link to='/'>Root</Link>
      </div>
    );
  }
}
