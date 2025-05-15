import { TopologyNode } from '../components/topology/topology.type';

export enum MachineStatus {
  UP,
  DOWN,
  UNKNOWN,
}

export interface MachineTopologyData {
  status: MachineStatus;
  owner: string;
  version: string;
}

export type MachineTopologyNode = TopologyNode<MachineTopologyData>;
export type MachineTopologyNodes = Array<MachineTopologyNode>;
