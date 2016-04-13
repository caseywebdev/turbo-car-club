import {Component} from 'pave-react';
import live from '../utils/live';
import React from 'react';
import SetName from './set-name';
import SignIn from './sign-in';
import store from '../utils/store';

export default class extends Component {
  store = store;

  getPaveWatchQuery() {
    return [[
      ['authToken'],
      ['user']
    ]];
  }

  getPaveQuery() {
    if (store.get(['authToken'])) return ['user'];
  }

  getPaveState() {
    return {
      authToken: store.get(['authToken']),
      user: store.get(['user'])
    };
  }

  componentWillMount() {
    super.componentWillMount();
    live.on('auth', this.handleAuth);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    live.off(this.handleAuth);
  }

  handleAuth = () => this.reloadPave();

  signOut() {
    store.run({query: ['signOut!']});
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
