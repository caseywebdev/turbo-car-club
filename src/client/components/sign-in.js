import React, {Component} from 'react';
import store from '../utils/store';

export default class extends Component {
  state = {
    error: null,
    isLoading: false
  };

  handleKeyDown({key, target: {value: emailAddress}}) {
    if (key !== 'Enter') return;

    this.setState({
      error: null,
      isLoading: true
    });

    store
      .run({query: ['sign-in!', {emailAddress}]})
      .then(() => {
        console.log('email sent');
      })
      .catch(er => {
        console.error(er);
      });
  }

  render() {
    return (
      <input onKeyDown={::this.handleKeyDown} />
    );
  }
}
