// = require node_modules/amdainty/amdainty.js
// = requireself
// = require ./init.js

import Index from 'client/components/index';
import React from 'react';
import ReactDOM from 'react-dom';

if (__DEV__) {
  var script = document.createElement('script');
  script.src = 'http://localhost:35729/livereload.js';
  script.async = true;
  document.body.appendChild(script);
}

ReactDOM.render(<Index />, document.getElementById('main'));
