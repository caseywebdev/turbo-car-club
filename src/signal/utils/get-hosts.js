import _ from 'underscore';
import sockets from '../utils/sockets';

export default () => _.compact(_.map(sockets.all, 'host'));
