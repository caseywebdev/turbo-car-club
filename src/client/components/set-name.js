import React, {Component} from 'react';
import store from '../utils/store';

export default class extends Component {
  state = {
    error: null,
    isLoading: false
  };

  handleKeyDown({key, target: {value: name}}) {
    if (key !== 'Enter') return;

    this.setState({
      error: null,
      isLoading: true
    });

    store
      .run({query: ['user!', {name}]})
      .then(() => {
        console.log('name set');
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
