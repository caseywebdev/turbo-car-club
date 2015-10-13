// = require node_modules/amdainty/amdainty.js
// = requireself
// = require ./init-worker.js

import Game from 'shared/objects/game';

const game = new Game(message => postMessage(message));
onmessage = e => game.handleMessage(e.data);
