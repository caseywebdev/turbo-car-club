// import * as app from 'signal';
// // import async from 'async';
// import config from 'signal/config';
// import verify from 'shared/utils/verify';
//
// const {key, errors: {invalidKey, keyExpired}} = config;
//
// export default (socket, signed, cb) => {
//   const data = verify(key, signed);
//   if (!data || data.type !== 'verify') return cb(invalidKey);
//
//   const {emailAddress, expiresAt, type, userId} = token;
//   if (!emailAddress || !expiresAt || type !== 'verify' || !userId) {
//     return cb(INVALID_TOKEN);
//   }
//
//   if (Date.now() > new Date(expiresAt)) return cb(TOKEN_EXPIRED);
//
//   app.knex('email_addresses')
//     .insert({email_address: emailAddress, user_id: userId});
//   // async.waterfall([
//   //   cb =>
//   //     app.knex.db
//   //       .select('*')
//   //       .from('users')
//   //       .where({id: userId})
//   //       .asCallback(cb),
//   //   ([user], cb) => {
//   //     if (!user) return cb(INVALID_TOKEN);
//   //   }
//   // ], cb);
// };
