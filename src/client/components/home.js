import cx from '../utils/cx';
import React from 'react';
import Hosts from './hosts';
import User from './user';

const {home: cxl} = cx;

export default () =>
  <div className={cxl.root}>
    <User />
    <Hosts />
  </div>;
