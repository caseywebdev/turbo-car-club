import cx from '../../utils/cx';
import React, {Component, PropTypes} from 'react';

const {layoutsMain: cxl} = cx;

export default class extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div>
        <img className={cxl.logo} src='/gfx/logo.svg' />
        {this.props.children}
      </div>
    );
  }
}
