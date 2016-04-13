import auth from '../utils/auth';
import config from '../config';
import router from '../routes/index';
import {SyncPromise} from 'pave';

const {invalidKey} = config.errors;

const tryAuth = (socket, authToken) =>
  SyncPromise
    .resolve()
    .then(() => authToken && auth(socket, authToken))
    .catch(er => {
      if (er === invalidKey) return {authToken: {$set: null}};
      throw er;
    });

export default ({socket, params: {query, authToken}}) =>
  tryAuth(socket, authToken)
    .then(authTokenDelta =>
      router
        .run({query, context: {socket}})
        .then(delta => authTokenDelta ? [authTokenDelta, delta] : delta)
    );
