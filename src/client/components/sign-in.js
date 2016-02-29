import React from 'react';
import {Component} from 'pave-react';
import store from '../utils/store';

export default class extends Component {
  store = store;

  handleKeyDown({key, target: {value: emailAddress}}) {
    if (key !== 'Enter') return;
    this.updatePave({query: ['sign-in!', {emailAddress}]});
  }

  render() {
    return <input placeholder='Sign In' onKeyDown={::this.handleKeyDown} />;
  }
}
