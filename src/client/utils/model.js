import _ from 'underscore';
import falcor from 'falcor';
import live from './live';
import Observable from '../../shared/utils/observable';

const req = (method, ...args) =>
  Observable.create(observer => {
    live.send('jsong', {method, args}, (er, res) => {
      if (er) return observer.onError(er);
      observer.onNext(res);
      observer.onCompleted();
    });
    return _.noop();
  });

export default new falcor.Model({
  source: _.reduce(
    ['get', 'set', 'call'],
    (obj, method) => (obj[method] = _.partial(req, method)) && obj,
    {}
  )
});
