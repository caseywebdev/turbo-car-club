import Layout from '../components/layout';
import Index from '../components/index';
import NotFound from '../components/not-found';
import Verify from '../components/verify';

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
