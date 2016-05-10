import cx from '../utils/cx';
import React from 'react';
import Hosts from './hosts';
import User from './user';

const {index: cxl} = cx;

export default () =>
  <div>
    <img className={cxl.logo} src='/gfx/logo.svg' />
    <User />
    <Hosts />
  </div>;
