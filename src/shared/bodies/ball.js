import Ammo from 'ammo.js';
import config from '../config';
import createBody from '../utils/create-body';

const SHAPE = new Ammo.btSphereShape(config.ball.radius);

export default () => createBody({shape: SHAPE, ...config.ball});
