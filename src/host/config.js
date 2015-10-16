const ENV = process.env;

export default {
  port: ENV.PORT,
  log: {name: 'host'},
  signal: {
    url: ENV.SIGNAL_URL
  }
};
