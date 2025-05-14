import { TopologyNode, TopologyNodes } from '../topology.type';

type TopologyNodesById = Record<string, Omit<TopologyNode, 'id'>>;

export function getTopologyNodesById(nodes: TopologyNodes): TopologyNodesById {
  return Object.fromEntries(
    nodes.map((node) => {
      const { id, ...nodeData } = node;
      return [id, nodeData];
    }),
  );
}
