import cx from '../utils/cx';
import React from 'react';
import Regions from './regions';

const {home: cxl} = cx;

export default () =>
  <div className={cxl.root}>
    <Regions />
  </div>;
