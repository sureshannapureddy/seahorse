/**
 * Copyright (c) 2015, CodiLime Inc.
 *
 * Owner: Grzegorz Swatowski
 */

'use strict';

let GenericParameter = require('./../common-generic-parameter.js');

function ChoiceParameter() {}

ChoiceParameter.prototype = new GenericParameter();
ChoiceParameter.prototype.constructor = GenericParameter;

ChoiceParameter.prototype.init = function(options) {
  this.name = options.name;
  this.schema = options.schema;
  this.possibleChoicesList = _.assign({}, options.possibleChoicesList);

  this.choices = {};
  for (let choiceName in this.possibleChoicesList) {
    this.choices[choiceName] = false;
  }

  for (let i = 0; i < options.choices.length; ++i) {
    this.choices[options.choices[i]] = true;
  }
};

ChoiceParameter.prototype.serialize = function () {
  if (this.isDefault) {
    return null;
  }

  let serializedObject = {};

  for (let choiceName in this.choices) {
    if (this.choices[choiceName]) {
      serializedObject[choiceName] = this.possibleChoicesList[choiceName].serialize();
    }
  }

  return serializedObject;
};

ChoiceParameter.prototype.validate = function () {
  for (let choiceName in this.choices) {
    let paramIsValid = this.possibleChoicesList[choiceName].validate();
    if (!paramIsValid) {
      return false;
    }
  }

  return true;
};

ChoiceParameter.prototype.refresh = function(node) {
  _.forOwn(this.possibleChoicesList, (params, _) => params.refresh(node));
};

module.exports = ChoiceParameter;
