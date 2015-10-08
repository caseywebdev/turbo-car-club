import Ammo from 'ammo';
import createBody from 'shared/utils/create-body';
import config from 'shared/config';

const {width, height, depth} = config.car.chassis;

const SHAPE =
  new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));

export default () => createBody({shape: SHAPE, ...config.car.chassis});
