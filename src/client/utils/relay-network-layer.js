import _ from 'underscore';
import live from './live';
import Relay from 'react-relay';

const sendReq = req =>
  new Promise((resolve, reject) =>
    live.send('graphql', {
      query: req.getQueryString(),
      variables: req.getVariables()
    }, (er, res) => er ? reject(er) : resolve(res))
  );

const myNetworkLayer = {
  sendMutation(req) {
    return sendReq(req);
  },

  sendQueries(reqs) {
    return Promise.all(_.map(reqs, sendReq));
  },

  supports(...options) {
    return _.all(options, _.constant(true));
  }
};

Relay.injectNetworkLayer(myNetworkLayer);
