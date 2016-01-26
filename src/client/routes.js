// = link src/signal/data/schema.json

import CreateHostKey from './components/sign-host';
import Layout from './components/layout';
import Index from './components/index';
import NotFound from './components/not-found';
import Verify from './components/verify';
import Relay from 'react-relay';
import React from 'react';

export default [
  {
    path: '/',
    component: Layout,
    indexRoute: {
      component: Index,
      queries: {
        viewer: () => Relay.QL`query {viewer}`
      }
    },
    childRoutes: [
      {
        path: 'sign-host',
        component: CreateHostKey,
        queries: {
          signedHost: () => Relay.QL`query {signedHost(name: $name)}`
        },
        renderFailure: (error) => <div>{error.toString()}</div>,
        queryParams: ['name']
      },
      {path: 'verify', component: Verify},
      {path: '*', component: NotFound}
    ]
  }
];
