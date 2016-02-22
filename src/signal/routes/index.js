import {Router} from 'pave';

import auth from './auth';
import hostKey from './host-key';
import hosts from './hosts';
import hostsById from './hosts-by-id';
import notFound from './not-found';
import signIn from './sign-in';
import user from './user';
import usersById from './users-by-id';
import verify from './verify';

export default new Router({
  maxQueryCost: 10000,
  routes: {
    ...auth,
    ...hostKey,
    ...hosts,
    ...hostsById,
    ...notFound,
    ...signIn,
    ...user,
    ...usersById,
    ...verify
  }
});
