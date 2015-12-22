import _ from 'underscore';
import * as app from 'signal';

export default (socket, __, cb) => {
  const hosts = _.compact(_.map(app.live.sockets, 'host'));
  console.log(hosts);
  // TODO: return [{region, name, user: {id, name}}]
  cb(null, hosts);
};
