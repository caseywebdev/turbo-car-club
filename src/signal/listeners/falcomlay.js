import router from '../routes/index';
import {run, getQueryCost} from '../../shared/utils/falcomlay';

const EXPENSIVE_QUERY_ERROR = new Error('Query is too expensive');

export default ({socket, params: {query}}) => {
  if (getQueryCost(query) > 10000) throw EXPENSIVE_QUERY_ERROR;
  return run({router, query, context: {socket}});
};
