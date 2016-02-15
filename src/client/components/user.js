import FalcomlayComponent from './falcomlay-component';
import React from 'react';
import SignIn from './sign-in';
import SetName from './set-name';
import store from '../utils/store';

export default class extends FalcomlayComponent {
  store = store;

  getQuery() {
    return ['user', ['id', 'name', 'emailAddress']];
  }

  getPaths() {
    return {
      user: ['user']
    };
  }

  render() {
    const {error, isLoading, user} = this.state;
    return (
      <div>
        <div>User</div>
        {isLoading ? 'Loading...' : null}
        {
          error ?
          <SignIn /> :
          <div>
            <pre>{JSON.stringify(user)}</pre>
            <SetName />
          </div>
        }
      </div>
    );
  }
}
