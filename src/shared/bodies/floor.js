import Ammo from 'ammo.js';
import config from '../config';
import createBody from '../utils/create-body';

const SHAPE = new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, 1, 0), 0);

export default () => createBody({shape: SHAPE, ...config.floor});
