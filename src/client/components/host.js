import cx from '../utils/cx';
import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React from 'react';

const {host: cxl} = cx;

const render = ({host: {owner: {$ref}, name}}) =>
  <div className={cxl.root}>
    <div className={cxl.name}>{name}</div>
    <div className={cxl.owner}>{getUserDisplayName(get(db, $ref))}</div>
  </div>;

render.fragments = () => ({
  host: ['name', ['owner', ['id', 'name']]]
});

export default render;
