import cx from '../../utils/cx';
import React, {Component, PropTypes} from 'react';
import User from '../user';

const {layoutsMain: cxl} = cx;

export default class extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div>
        <div className={cxl.headerWrapper}>
          <div className={cxl.header}>
            <div className={cxl.headerLeft}>
              <img className={cxl.logo} src='/gfx/logo.svg' />
            </div>
            <div className={cxl.headerRight}>
              <User />
            </div>
          </div>
        </div>
        <div className={cxl.body}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
