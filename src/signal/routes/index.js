import {createRouter} from '../../shared/utils/falcomlay';

import auth from './auth';
import authHost from './auth-host';
import hosts from './hosts';
import hostsById from './hosts-by-id';
import notFound from './not-found';
import signIn from './sign-in';
import user from './user';
import usersById from './users-by-id';
import verify from './verify';

export default createRouter({
  ...auth,
  ...authHost,
  ...hosts,
  ...hostsById,
  ...notFound,
  ...signIn,
  ...user,
  ...usersById,
  ...verify
});
