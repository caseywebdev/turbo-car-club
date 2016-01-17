import config from '../config';
import jwt from 'jsonwebtoken';

const {verifyAlgorithms: algorithms} = config.jwt;

export default (key, subject, token, maxAge) => {
  try {
    return jwt.verify(token, key, {algorithms, subject, maxAge});
  } catch (er) {}
};
