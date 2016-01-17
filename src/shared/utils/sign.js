import config from '../config';
import jwt from 'jsonwebtoken';

const {signAlgorithm: algorithm} = config.jwt;

export default (key, subject, obj) => jwt.sign(obj, key, {algorithm, subject});
