import Ammo from 'ammo';
import createBody from 'shared/utils/create-body';
import config from 'shared/config';

const {radius, width} = config.wheel;

const SHAPE =
  new Ammo.btCylinderShapeX(new Ammo.btVector3(width / 2, radius, radius));

export default (world) => createBody({shape: SHAPE, ...config.wheel});
