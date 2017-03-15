import {withPave} from 'pave-react';
import getAvatarUrl from '../../shared/utils/get-avatar-url';
import live from '../utils/live';
import React from 'react';
import SetName from './set-name';
import SignIn from './sign-in';
import store from '../utils/store';

const expireTokens = ({props: {pave: {store}}}) =>
  store.run({query: ['expireTokens!']});

const signOut = ({props: {pave: {store}}}) => {
  store.update({authToken: {$set: null}, user: {$set: null}});
  live.socket.close();
};

const render = ({props, props: {pave: {cache: {user}, error, isLoading}}}) =>
  <div>
    {
      user ?
        <div>
          <SetName />
          <button onClick={() => signOut({props})}>Sign Out</button>
          <button onClick={() => expireTokens({props})}>Expire Tokens</button>
          <img src={getAvatarUrl(user.emailHash)} />
        </div> :
      isLoading ? 'Loading...' :
      error ? error.toString() :
      <SignIn />
    }
  </div>;

export default withPave(
  props => render({props}),
  {
    getQuery: () => [[].concat(
      [['authToken']],
      store.get(['authToken']) ? [['user', ['id', 'name', 'emailHash']]] : []
    )],

    getCache: () => ({
      authToken: store.get(['authToken']),
      user: store.get(['user'])
    })
  }
);
