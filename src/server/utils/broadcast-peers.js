import _ from 'underscore';
import * as app from 'server';

export default () => {
  const {sockets} = app.live;
  const ids = _.map(sockets, 'id');
  _.each(sockets, socket =>
    socket.send('peers', {self: socket.id, rest: _.without(ids, socket.id)})
  );
};
