import BetterPromise from 'better-promise';

export default fn =>
  (...args) =>
    new BetterPromise((resolve, reject) =>
      fn(...args, (er, res) => er ? reject(er) : resolve(res))
    );
