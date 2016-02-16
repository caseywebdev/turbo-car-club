import disk from './disk';
import {Store, Router} from 'pave';
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
        return send('pave', {
          query: [[
            token ? ['auth!', {token}] : [],
            ...paths
          ]]
        });
      }
    }
  })
});

export default store;
