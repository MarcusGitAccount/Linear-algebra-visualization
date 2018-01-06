'use strict';

import {default as Scene} from './modules/Scene.js';

const canvas  = document.querySelector('#main-scene');
const options = {
  size: {
    height: 700,
    width: 1200
  }
};

const plan = new Scene(canvas, options, [0, 0], 25 * 2);

plan.init();
plan.axisOrt([[1, 3], [2, 0]], 'red', true, {color: '#ffcdd2'});
plan.dot([-2, 2], 2, '#F400A1');
plan.vector([5, -3], '#2196f3');
plan.vector([-1, 3], '#009688');
plan.vector([5, 3], '#1b5e20');