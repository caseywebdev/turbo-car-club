import Layout from './components/layout';
import Index from './components/index';
import NotFound from './components/not-found';
import Verify from './components/verify';
import Relay from 'react-relay';

export default [
  {
    path: '/',
    component: Layout,
    indexRoute: {
      component: Index,
      queries: {
        hosts: () => Relay.QL`query { hosts }`
      }
    },
    childRoutes: [
      {path: 'verify', component: Verify},
      {path: '*', component: NotFound}
    ]
  }
];
