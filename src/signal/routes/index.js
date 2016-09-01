import {Router} from 'pave';
import auth from './auth';
import expireTokens from './expire-tokens';
import notFound from './not-found';
import signIn from './sign-in';
import user from './user';
import usersById from './users-by-id';
import verify from './verify';

export default new Router({
  maxQueryCost: 10000,
  routes: {
    ...auth,
    ...expireTokens,
    ...notFound,
    ...signIn,
    ...user,
    ...usersById,
    ...verify
  }
});
