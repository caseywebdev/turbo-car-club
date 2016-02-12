import disk from './disk';
import {Store, Router} from '../../shared/utils/falcomlay';
import live from './live';
import promisify from '../../shared/utils/promisify';

const send = promisify(::live.send);

const store = new Store({
  db: {
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

live.on('change', ::store.applyChange);

store.watch(['authToken'], console.log.bind('auth token changed!'));

export default store;
