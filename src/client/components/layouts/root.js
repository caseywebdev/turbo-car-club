import {BrowserRouter, Route, Switch} from 'react-router';
import {withPave} from 'pave-react';
// import Home from './components/home';
// import MainLayout from './components/layouts/main';
import Meta from '../meta';
import NotFound from '../not-found';
import React from 'react';
import store from '../../utils/store';
// import Verify from './components/verify';

// export default [
//   {
//     component: RootLayout,
//     childRoutes: [
//       {
//         path: '/games/:id',
//         component: NotFound
//       },
//       {
//         component: MainLayout,
//         childRoutes: [
//           {path: '/', component: Home},
//           {path: '/verify', component: Verify},
//           {path: '/*', component: NotFound}
//         ]
//       }
//     ]
//   }
// ];

const render = () =>
  <BrowserRouter>
    <Meta title='Turbo Car Club'>
      <Switch>
        <Route component={NotFound} />
      </Switch>
    </Meta>
  </BrowserRouter>;

export default withPave(props => render({props}), {store});
