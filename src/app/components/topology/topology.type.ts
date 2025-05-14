export interface BaseTopologyNodeData {
  name: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface NodeSize {
  width: number;
  height: number;
}

export interface TopologyNode<
  T extends BaseTopologyNodeData = BaseTopologyNodeData,
> {
  id: string;
  position: Position;
  data: T;
}

export interface TopologyLink {
  source: string;
  target: string;
}

export type TopologyNodes = Array<TopologyNode>;
export type TopologyLinks = Array<TopologyLink>;
