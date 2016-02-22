import {SyncPromise} from 'pave';

export default fn =>
  (...args) =>
    new SyncPromise((resolve, reject) =>
      fn(...args, (er, res) => er ? reject(er) : resolve(res))
    );
