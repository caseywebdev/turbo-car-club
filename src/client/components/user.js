import createContainer from '../utils/create-container';
import React from 'react';

export default createContainer(
  ({isLoading, user}) =>
    <div>
      <div>User</div>
      {isLoading ? 'Loading...' : null}
      {user instanceof Error ? 'Oh No!' : JSON.stringify(user)}
    </div>,
  {
    queries: () => ({
      user: ['user', ['id', 'name', 'emailAddress']]
    })
  }
);
