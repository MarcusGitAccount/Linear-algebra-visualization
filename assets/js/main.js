'use strict';

import {default as Scene} from './modules/Scene.js';
import {default as Snake} from './games/Snake.js';
import {det} from './modules/Vectors.js';

const canvas  = document.querySelector('#main-scene');
const options = {
  size: {
    height: 700,
    width: 1200
  }
};

const game = new Snake(canvas, {height: 720, width: 1200, tile: 60}, null, 10, 5);


// plan.init();
// plan.axisOrt([[1, 3], [2, 0]], 'red', true, {color: '#ffcdd2'});
// plan.dot([-2, 2], 2, '#F400A1');
// plan.vector([5, -3], '#2196f3');
// plan.vector([-1, 3], '#009688');
// plan.vector([5, 3], '#1b5e20');