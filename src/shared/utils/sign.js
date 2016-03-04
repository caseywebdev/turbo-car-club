import jwt from 'jsonwebtoken';

export default (key, subject, obj) => jwt.sign(obj, key, {subject});
