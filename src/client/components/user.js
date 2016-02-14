import createContainer from '../utils/create-container';
import React from 'react';
import SignIn from './sign-in';
import SetName from './set-name';

export default createContainer(
  ({error, isLoading, user}) =>
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
    </div>,
  {
    query: () => ['user', ['id', 'name', 'emailAddress']],

    paths: () => ({user: ['user']})
  }
);
