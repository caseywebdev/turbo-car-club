import createContainer from '../utils/create-container';
import React from 'react';

export default createContainer(
  ({error, isLoading, user}) =>
    <div>
      <div>User</div>
      {isLoading ? 'Loading...' : null}
      {error ? error.toString() : JSON.stringify(user)}
    </div>,
  {
    query: () => ['user', ['id', 'name', 'emailAddress']],

    props: () => ({user: ['user']})
  }
);
