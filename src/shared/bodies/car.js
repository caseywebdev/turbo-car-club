import Ammo from 'ammo';
import createBody from 'shared/utils/create-body';
import config from 'shared/config';

const {width, height, depth} = config.car;

const CHASSIS_SHAPE =
  new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));

export default () => {
  const body = createBody({shape: CHASSIS_SHAPE, mass: config.car.mass});
  return body;
};
