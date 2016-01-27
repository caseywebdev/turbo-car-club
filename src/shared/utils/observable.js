import _ from 'underscore';

export default class Observable {
  static create = subscribe => {
    const observable = new Observable();
    observable.subscribe = (onNext, onError, onCompleted) => {
      const observer =
        typeof onNext === 'function' ? {
          onNext: onNext,
          onError: onError || _.noop,
          onCompleted: onCompleted || _.noop
        } : onNext;
      const dispose = subscribe(observer);
      return typeof dispose === 'function' ? {dispose} : dispose;
    };
    return observable;
  };
}
