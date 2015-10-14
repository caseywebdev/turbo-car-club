import Ammo from 'ammo.js';
import config from 'shared/config';
import createBody from 'shared/utils/create-body';

const SHAPE = new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, 1, 0), 0);

export default () => createBody({shape: SHAPE, ...config.floor});
