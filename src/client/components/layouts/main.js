import React, {Component, PropTypes} from 'react';
import styles from '../../styles/layouts/main';
import User from '../user';

export default class extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div>
        <div className={styles.headerWrapper}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <img className={styles.logo} src='/gfx/logo.svg' />
            </div>
            <div className={styles.headerRight}>
              <User />
            </div>
          </div>
        </div>
        <div className={styles.body}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
