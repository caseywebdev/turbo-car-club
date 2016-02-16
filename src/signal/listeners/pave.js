import router from '../routes/index';

export default ({socket, params: {query}}) =>
  router.run({query, context: {socket}});
