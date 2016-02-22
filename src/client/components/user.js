import {Component} from 'pave-react';
import React from 'react';
import SignIn from './sign-in';
import SetName from './set-name';
import store from '../utils/store';

export default class extends Component {
  store = store;

  getPaveQuery() {
    const token = store.get(['authToken']);
    if (!token) return [];
    return [[
      ['auth!', {token}],
      ['user', ['id', 'name', 'emailAddress']]
    ]];
  }

  getPaveState() {
    return {
      user: store.get(['user'])
    };
  }

  render() {
    const {error, isLoading, user} = this.state;
    return (
      <div>
        <div>User</div>
        {
          isLoading ? 'Loading...' :
          error ? error.toString() :
          user ?
            <div>
              <pre>{JSON.stringify(user)}</pre>
              <SetName />
            </div> :
          <SignIn />
        }
      </div>
    );
  }
}
