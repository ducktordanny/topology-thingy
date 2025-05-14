import { TopologyNodes } from '../../topology.type';
import {
  getTopologyNodesById,
  TopologyNodesById,
} from '../topology-nodes-by-id.util';

const inputMock: TopologyNodes = [
  {
    id: 'A',
    position: {
      x: 100,
      y: 100,
    },
    data: {},
  },
  {
    id: 'B',
    position: {
      x: 100,
      y: 100,
    },
    data: {},
  },
];
const outputMock: TopologyNodesById = {
  A: {
    position: {
      x: 100,
      y: 100,
    },
    data: {},
  },
  B: {
    position: {
      x: 100,
      y: 100,
    },
    data: {},
  },
};

describe('getTopologyNodesById', () => {
  it('should transform array of nodes into object with id keys', () => {
    const result = getTopologyNodesById(inputMock);
    expect(result).toEqual(outputMock);
  });
});
