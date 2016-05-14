import live from '../utils/live';
import PaveSubscription from 'pave-subscription';
import React, {Component} from 'react';
import SetName from './set-name';
import SignIn from './sign-in';
import store from '../utils/store';
import getAvatarUrl from '../../shared/utils/get-avatar-url';

const getQuery = () => [[].concat(
  [['authToken']],
  store.get(['authToken']) ? [['user', ['id', 'name', 'emailHash']]] : []
)];

const getState = () => ({
  authToken: store.get(['authToken']),
  user: store.get(['user'])
});

export default class extends Component {
  componentWillMount() {
    this.sub = new PaveSubscription({
      store,
      query: getQuery(),
      onChange: sub => {
        sub.setQuery(getQuery());
        this.setState({
          error: sub.error,
          isLoading: sub.isLoading,
          ...getState()
        });
      }
    });
  }

  componentWillUnmount() {
    this.sub.destroy();
  }

  signOut() {
    store.update({authToken: {$set: null}, user: {$set: null}});
    live.socket.close();
  }

  expireTokens() {
    store.run({query: ['expireTokens!']});
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
              <img src={getAvatarUrl(user.emailHash)} />
              <pre>{authToken}</pre>
              <SetName />
              <button onClick={::this.signOut}>Sign Out</button>
              <button onClick={::this.expireTokens}>Expire Tokens</button>
            </div> :
          <SignIn />
        }
      </div>
    );
  }
}
