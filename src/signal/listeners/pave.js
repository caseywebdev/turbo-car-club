import {Store} from 'pave';
import auth from '../utils/auth';
import BetterPromise from 'better-promise';
import config from '../config';
import router from '../routes';

const {invalidKey} = config.errors;

const tryAuth = (socket, authToken) =>
  BetterPromise
    .resolve()
    .then(() => authToken && auth(socket, authToken))
    .catch(er => {
      if (er === invalidKey) return {authToken: {$set: null}};
      throw er;
    });

export default ({socket, params: {query, authToken}}) =>
  tryAuth(socket, authToken).then(authTokenDelta =>
    (new Store({cache: {socket}, router})).run({query}).then(delta =>
      authTokenDelta ? [authTokenDelta, delta] : delta
    )
  );
