import {Route, Switch} from 'react-router-dom';
import Home from '../home';
import NotFound from '../not-found';
import React from 'react';
import styles from '../../styles/layouts/main';
import User from '../user';
import Verify from '../verify';

export default () =>
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
      <Switch>
        <Route exact path='/verify' component={Verify} />
        <Route exact path='/' component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </div>;
