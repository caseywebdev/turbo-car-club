import _ from 'underscore';
import {withPave} from 'pave-react';
import React from 'react';

const renderRegion = ({id, ping}) =>
  <div key={id}>
    {id} {ping == null ? '...' : Math.floor(ping * 1000)} ping
  </div>;

const render = ({props: {pave: {cache: {regions}, error}}}) =>
  <div>{error ? error.toString() : _.map(regions, renderRegion)}</div>;

export default withPave(
  props => render({props}),
  {
    getQuery: ({store}) => [
      'regionsById',
      _.keys(store.get(['regionsById'])),
      ['id', 'url', 'ping']
    ],

    getCache: ({store}) => ({regions: store.get(['regions'])})
  }
);
