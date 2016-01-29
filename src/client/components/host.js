import cx from '../utils/cx';
import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';
import $join from '../utils/join';

const {host: cxl} = cx;

const render = ({host: {owner, name}}) =>
  <div className={cxl.root}>
    <div className={cxl.name}>{name}</div>
    <div className={cxl.owner}>{getUserDisplayName(owner)}</div>
  </div>;

render.fragments = () => ({
  host: ['name', $join({owner: [['id', 'name']]})]
});

export default render;
