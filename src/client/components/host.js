import _ from 'underscore';
import cx from '../utils/cx';
import getUserDisplayName from '../../shared/utils/get-user-display-name';
import React, {PropTypes} from 'react';

const {host: cxl} = cx;

const render = _.extend(
  ({host: {owner, name}}) =>
    <div className={cxl.root}>
      <div className={cxl.name}>{name}</div>
      <div className={cxl.owner}>{getUserDisplayName(owner)}</div>
    </div>,
  {
    propTypes: {
      host: PropTypes.shape({
        owner: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    },

    fragments: () => ({
      host: ['name', ['owner', ['id', 'name']]]
    })
  }
);

export default render;
