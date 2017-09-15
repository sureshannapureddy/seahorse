'use strict';

let GenericParameter = require('./common-generic-parameter.js');

function GridSearchParameter({name, value, schema}, node, paramsFactory) {
  this.name = name;
  this.initValue(value, schema);
  this.schema = schema;
  this.paramsFactory = paramsFactory;

  this.setInternalParams(node);
}

GridSearchParameter.prototype = new GenericParameter();
GridSearchParameter.prototype.constructor = GenericParameter;

GridSearchParameter.prototype.serialize = function () {
    return this.internalParams ? this.internalParams.serialize() : {};
};

GridSearchParameter.prototype.setInternalParams = function (node) {
    let inputPort = this.schema.inputPort;
    let incomingKnowledge = node.getIncomingKnowledge(inputPort);
    let inferredResultDetails = incomingKnowledge && incomingKnowledge.result;
    this.internalParamsAvailable = inferredResultDetails ? true : false;

    if (this.internalParamsAvailable) {
        // We assume that if dynamic params is declared, inferred result details have 'params' field.
        let inferredParams = inferredResultDetails.params;

        // Here we pass inferred parameter values as defaults to dynamic parameters.
        let dynamicParamsSchema = inferredParams.schema.slice(0);
        _.forEach(inferredParams.values, function (value, key) {
          let schemaEntry = _.find(dynamicParamsSchema, function (item) {
            return item.name === key;
          });
          schemaEntry.default = value;
        });

        let gridParamsSchema = this._gridParamsSchema(inferredParams.schema);

        // Here we overwrite inferred values with values specified by user.
        // If at any point we wish to present information which values were overwritten,
        // here is the place to get this information.
        let gridParamsValues = _.assign({}, this.value, this.serialize());
        const isDynamic = true;

        this.internalParams = this.paramsFactory.createParametersList(
            gridParamsValues,
            gridParamsSchema,
            node,
            isDynamic
        );
    }
};

GridSearchParameter.prototype._isGriddable = function (paramSchema) {
    return !_.isUndefined(paramSchema.isGriddable) && paramSchema.isGriddable;
};

GridSearchParameter.prototype._multipleParamVersion = function(paramType) {
    switch(paramType) {
        case 'numeric':
            return 'multipleNumeric';
        default:
            return paramType;
    }
};

GridSearchParameter.prototype._gridParamsSchema = function (originalSchema) {
    return _.map(originalSchema, (paramSchema) => this._deepConvertSchemaToGrid(paramSchema));
};

/**
 * Recursively updates parameter schema, converting params to their grid versions
 */
GridSearchParameter.prototype._deepConvertSchemaToGrid = function (paramSchema) {
    let flatUpdated = this._isGriddable(paramSchema) ? this._convertSchemaToGrid(paramSchema) : paramSchema;
    if (_.isUndefined(flatUpdated.values)) {
        return flatUpdated;
    } else {
        let updatedValues = _.map(
            flatUpdated.values,
            (choiceOption) => _.assign({}, choiceOption, {
                schema: this._gridParamsSchema(choiceOption.schema)
            }));
        return _.assign({}, paramSchema, {
            values: updatedValues
        });
    }
};

GridSearchParameter.prototype._convertSchemaToGrid = function (paramDescription) {
    return _.assign({}, paramDescription, {
        type: this._multipleParamVersion(paramDescription.type),
        default: this._gridWrapValue(paramDescription.default, paramDescription),
        isGriddable: false,
        isGrid: true
    });
};

GridSearchParameter.prototype._findParamByName = function (schema, paramName) {
    return _.find(schema, (param) => param.name === paramName);
};

GridSearchParameter.prototype._gridWrapValue = function (paramValue, paramDescription) {
    if (paramValue === null) {
        return null;
    }
    switch(paramDescription.type) {
        case 'numeric':
            return {
                values: [{
                    type: 'seq',
                    value: {
                        sequence: [paramValue]
                    }
                }]
            };
        default:
            throw 'Grid search value wrapping is not implemented for type "' + paramDescription.type + '"';
    }
};

GridSearchParameter.prototype.refresh = function (node) {
    this.setInternalParams(node);
    if (this.internalParams) {
        this.internalParams.refresh(node);
    }
};

module.exports = GridSearchParameter;
