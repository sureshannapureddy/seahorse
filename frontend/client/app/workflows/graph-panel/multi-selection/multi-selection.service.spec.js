'use strict';

describe('MultiSelectionService', () => {
  let MultiSelectionService;

  beforeEach(() => {
    let module = angular.module('service', []);
    require('./multi-selection.service').inject(module);
    angular.mock.module('service');
    angular.mock.inject((_MultiSelectionService_) => {
      MultiSelectionService = _MultiSelectionService_;
    });
  });

  afterEach(() => {
    MultiSelectionService.clearSelection();
  });

  it('should return empty array is nothing is selected', () => {
    expect(MultiSelectionService.getSelectedNodeIds()).toEqual([]);
  });

  it('should return nodeId when an element was added to selection', () => {
    let nodeId = 'node-' + Math.random().toString();
    MultiSelectionService.addNodeIdsToSelection([nodeId]);
    expect(MultiSelectionService.getSelectedNodeIds()).toContain(nodeId);
  });

  it('should return the same amount of elements that are added to selection if there are no duplicates', () => {
    const numberOfNodesAdded = 100;
    let nodes = [];
    for (let i = 0; i < numberOfNodesAdded; i++) {
      let nodeId = 'node-' + Math.random().toString();
      MultiSelectionService.addNodeIdsToSelection([nodeId]);
      nodes.push(nodeId);
    }
    expect(MultiSelectionService.getSelectedNodeIds()).toEqual(nodes);
  });

  it('shouldnt remove the added element', () => {
    let nodeId = 'node-' + Math.random().toString();
    MultiSelectionService.addNodeIdsToSelection([nodeId]);
    MultiSelectionService.removeNodeIdsFromSelection([nodeId]);
    expect(MultiSelectionService.getSelectedNodeIds()).toEqual([]);
  });

  it('shouldnt add the same elements twice', () => {
    let nodeId = 'node-' + Math.random().toString();
    MultiSelectionService.addNodeIdsToSelection([nodeId]);
    MultiSelectionService.addNodeIdsToSelection([nodeId]);
    expect(MultiSelectionService.getSelectedNodeIds()).toEqual([nodeId]);
  });

});
