import _ from 'underscore';
import live from './live';
import Relay from 'react-relay';

const sendReq = req =>
  live.send('graphql', {
    query: req.getQueryString(),
    variables: req.getVariables()
  }, (er, response) => er ? req.reject(er) : req.resolve({response}));

Relay.injectNetworkLayer({
  sendMutation: sendReq,
  sendQueries: _.partial(_.each, _, sendReq),
  supports: _.constant(true)
});
