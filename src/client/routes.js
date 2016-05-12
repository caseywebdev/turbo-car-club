import Home from './components/home';
import RootLayout from './components/layouts/root';
import MainLayout from './components/layouts/main';
import NotFound from './components/not-found';
import Verify from './components/verify';

export default [
  {
    component: RootLayout,
    childRoutes: [
      {
        path: '/games/:id',
        component: NotFound
      },
      {
        component: MainLayout,
        childRoutes: [
          {path: '/', component: Home},
          {path: '/verify', component: Verify},
          {path: '/*', component: NotFound}
        ]
      }
    ]
  }
];
