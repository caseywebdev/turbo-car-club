import Ammo from 'ammo.js';
import config from 'shared/config';
import createBody from 'shared/utils/create-body';

const SHAPE = new Ammo.btSphereShape(config.ball.radius);

export default () => createBody({shape: SHAPE, ...config.ball});
