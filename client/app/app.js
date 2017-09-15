/**
 * Copyright (c) 2015, CodiLime Inc.
 *
 * Owner: Piotr Zarówny
 */
'use strict';

var angular = require('angular');

/**
 * DesspSense.io LAB main module.
 */
var lab = angular.module('ds.lab', [
  'ui.router',
  'ui.bootstrap',
  require('./providers/providers.module.js').name,
  require('./home/home.module.js').name,
  require('./account/account.module.js').name,
  require('./experiments/experiments.module.js').name,
  require('./datasets/datasets.module.js').name,
  require('./common/common.module.js').name
]);

require('./app.config.js').inject(lab);
