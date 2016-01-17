import './utils/livereload';
import './utils/live';
import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory as history} from 'react-router';
import routes from './routes';
import '../shared/peer';

render(<Router {...{history, routes}} />, document.getElementById('main'));
