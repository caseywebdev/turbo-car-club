import React from 'react';
import store from '../utils/store';

const handleKeyDown = ({key, target: {value: name}}) => {
  if (key === 'Enter') store.run({query: ['user!', {name}]});
};

export default () =>
  <input
    defaultValue={store.get(['user', 'name'])}
    onKeyDown={handleKeyDown}
  />;
