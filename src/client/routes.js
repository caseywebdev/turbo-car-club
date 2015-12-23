import Layout from 'client/components/layout';
import Index from 'client/components/index';
import NotFound from 'client/components/not-found';
import Verify from 'client/components/verify';

export default [
  {
    path: '/',
    component: Layout,
    indexRoute: {component: Index},
    childRoutes: [
      {path: 'verify', component: Verify},
      {path: '*', component: NotFound}
    ]
  }
];
