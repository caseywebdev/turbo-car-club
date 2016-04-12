import db from '../utils/db';
import log from '../utils/log';

db.migrate.latest({directory: 'build/signal/migrations'}).catch(er => {
  log.error(er);
  process.exit(1);
});
