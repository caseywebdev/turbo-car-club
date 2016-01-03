// = require node_modules/amdainty/amdainty.js
// = requireself
// = require ./init.js

import 'client/utils/live-reload';
import 'client/utils/live';
import 'client/utils/fox';
import React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router';
import routes from 'client/routes';

render(<Router {...{routes}} />, document.getElementById('main'));
