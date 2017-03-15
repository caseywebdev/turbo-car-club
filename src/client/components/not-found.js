import {Link} from 'react-router-dom';
import Meta from './meta';
import React from 'react';

export default () =>
  <Meta title='Not Found'>
    <div>
      <div>Not Found!</div>
      <Link to='/'>Go Home</Link>
    </div>
  </Meta>;
