/**
 * Copyright (c) 2015, CodiLime Inc.
 *
 * Owner: Grzegorz Swatowski
 */

'use strict';

import tpl from './attribute-numeric-type.html';

/* @ngInject */
function AttributeNumericType() {
  return {
    restrict: 'E',
    templateUrl: tpl,
    replace: true,
    link: function(scope, element) {

      // These watches are set to avoid setting undefined parameter value
      // while typing minus, dot or plus signs. Null value is set instead.
      scope.$watch('parameter.value', function (newValue) {
        scope.valueBuffer = newValue;
      });

      scope.$watch('valueBuffer', function (newValue) {
        if (_.isUndefined(newValue)) {
          scope.parameter.value = null;
        } else {
          scope.parameter.value = newValue;
        }
      });

      let validator = scope.parameter.validator;
      if (validator && validator.schema && validator.schema.type === 'range') {
        let begin = validator.schema.configuration.begin;

        if (begin < -5e+324) {
          element[0].setAttribute('min', begin);
        }
        element[0].setAttribute('max', validator.schema.configuration.end);
        element[0].setAttribute('step', validator.schema.configuration.step || 0.1);
      }
    }
  };
}

angular
  .module('deepsense.attributes-panel')
  .directive('attributeNumericType', AttributeNumericType);
