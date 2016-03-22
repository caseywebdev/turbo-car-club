import React, {Component} from 'react';
import store from '../utils/store';

export default class extends Component {
  handleKeyDown({key, target: {value: emailAddress}}) {
    if (key === 'Enter') store.run({query: ['signIn!', {emailAddress}]});
  }

  render() {
    return <input placeholder='Sign In' onKeyDown={::this.handleKeyDown} />;
  }
}
