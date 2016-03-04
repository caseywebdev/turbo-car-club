import jwt from 'jsonwebtoken';

export default (key, subject, token, maxAge) => {
  try { return jwt.verify(token, key, {subject, maxAge}); } catch (er) {}
};
