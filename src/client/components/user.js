import {Component} from 'pave-react';
import React from 'react';
import SignIn from './sign-in';
import SetName from './set-name';
import store from '../utils/store';
import disk from '../utils/disk';

export default class extends Component {
  store = store;

  getPaveQuery() {
    if (store.get(['authToken'])) {
      return ['user', ['id', 'name', 'emailAddress']];
    }
  }

  getPaveState() {
    return {
      authToken: store.get(['authToken']),
      user: store.get(['user'])
    };
  }

  signOut() {
    disk.delete('authToken');
    store.set(['authToken'], undefined);
    store.set(['user'], undefined);
  }

  render() {
    const {error, isLoading, authToken, user} = this.state;
    return (
      <div>
        <div>User</div>
        {
          isLoading ? 'Loading...' :
          error ? error.toString() :
          user ?
            <div>
              <pre>{JSON.stringify(user)}</pre>
              <pre>{authToken}</pre>
              <SetName />
              <button onClick={::this.signOut}>Sign Out</button>
            </div> :
          <SignIn />
        }
      </div>
    );
  }
}
