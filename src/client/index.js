import './utils/set-global';
import './utils/livereload';
import './utils/live';
import './utils/relay-network-layer';
import React from 'react';
import {render} from 'react-dom';
import {RelayRouter as Router} from 'react-router-relay';
import {hashHistory as history} from 'react-router';
import routes from './routes';
import '../shared/peer';

render(<Router {...{history, routes}} />, document.getElementById('main'));
