import Ammo from 'ammo.js';
import createBody from '../utils/create-body';
import config from '../config';

const {width, height, depth} = config.car.chassis;

const SHAPE =
  new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));

export default () => createBody({shape: SHAPE, ...config.car.chassis});
