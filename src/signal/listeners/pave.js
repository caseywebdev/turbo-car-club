import auth from '../utils/auth';
import router from '../routes/index';
import {SyncPromise} from 'pave';

const tryAuth = (socket, authToken) =>
  SyncPromise.resolve().then(() => authToken && auth(socket, authToken));

export default ({socket, params: {query, authToken}}) =>
  tryAuth(socket, authToken).then(() => router.run({query, context: {socket}}));
