import React from 'react';
import store from '../utils/store';

const handleKeyDown = ({key, target: {value: name}}) => {
  if (key === 'Enter') store.run({query: ['updateUser!', {name}]});
};

export default () =>
  <input
    defaultValue={store.get(['user', 'name'])}
    onKeyDown={handleKeyDown}
  />;
