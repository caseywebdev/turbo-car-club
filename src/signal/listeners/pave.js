import auth from '../utils/auth';
import router from '../routes/index';
import {SyncPromise} from 'pave';

const tryAuth = (socket, authToken) =>
  new SyncPromise(resolve =>
    authToken ?
    auth(socket, authToken).then(resolve, resolve) :
    resolve()
  );

export default ({socket, params: {query, authToken}}) =>
  tryAuth(socket, authToken).then(() => router.run({query, context: {socket}}));
