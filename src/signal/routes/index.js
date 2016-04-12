import {Router} from 'pave';

import auth from './auth';
import hosts from './hosts';
import hostsById from './hosts-by-id';
import notFound from './not-found';
import signIn from './sign-in';
import signOut from './sign-out';
import user from './user';
import usersById from './users-by-id';
import verify from './verify';

export default new Router({
  maxQueryCost: 10000,
  routes: {
    ...auth,
    ...hosts,
    ...hostsById,
    ...notFound,
    ...signIn,
    ...signOut,
    ...user,
    ...usersById,
    ...verify
  }
});
