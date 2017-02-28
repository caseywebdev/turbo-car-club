import {withPave} from 'pave-react';
import Meta from '../meta';
import React from 'react';
import store from '../../utils/store';

const render = ({props: {children}}) =>
  <Meta title='Turbo Car Club'>{children}</Meta>;

export default withPave(props => render({props}), {store});
