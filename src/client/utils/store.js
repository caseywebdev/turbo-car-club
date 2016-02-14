import disk from './disk';
import {Store, Router} from '../../shared/utils/falcomlay';
import live from './live';
import promisify from '../../shared/utils/promisify';

const send = promisify(::live.send);

const store = new Store({
  cache: {
    authToken: disk.get('authToken')
  },
  router: new Router({
    routes: {
      '*': ({paths}) => {
        const token = store.get(['authToken']);
        return send('falcomlay', {
          query: [[
            token ? ['auth!', {token}] : [],
            ...paths
          ]]
        });
      }
    }
  })
});

live.on('falcomlay', ::store.applyChange);

export default store;
