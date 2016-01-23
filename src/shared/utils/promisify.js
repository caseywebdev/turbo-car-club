export default fn =>
  (...args) =>
    new Promise((resolve, reject) =>
      fn(...args, (er, res) => er ? reject(er) : resolve(res))
    );
