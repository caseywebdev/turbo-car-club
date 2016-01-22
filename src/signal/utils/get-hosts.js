import _ from 'underscore';
import app from '..';

export default () => _.compact(_.map(app.live.sockets, 'host'));
