import cx from '../utils/cx';
import React from 'react';
import Hosts from './hosts';

const {home: cxl} = cx;

export default () =>
  <div className={cxl.root}>
    <Hosts />
  </div>;
