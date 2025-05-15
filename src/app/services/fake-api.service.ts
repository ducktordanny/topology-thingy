import { Injectable, Signal, signal } from '@angular/core';

import {
  TopologyLink,
  TopologyLinks,
} from '../components/topology/topology.type';
import {
  MachineStatus,
  MachineTopologyNode,
  MachineTopologyNodes,
} from '../types/machine.type';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FakeApiService {
  // some random example data
  readonly _nodes = signal<MachineTopologyNodes>([
    {
      id: 'Bela',
      position: {
        x: 300,
        y: 100,
      },
      data: {
        status: MachineStatus.UP,
        owner: 'Bela',
        version: '12.23.1',
      },
    },
    {
      id: 'Cs1211',
      position: {
        x: 300,
        y: 300,
      },
      data: {
        status: MachineStatus.DOWN,
        owner: 'Csilla',
        version: '12',
      },
    },
    {
      id: 'P',
      position: {
        x: 500,
        y: 150,
      },
      data: {
        status: MachineStatus.UNKNOWN,
        owner: 'Peti',
        version: 'alma',
      },
    },
  ]);
  readonly _links = signal<TopologyLinks>([
    { source: 'Bela', target: 'Cs1211' },
    { source: 'Cs1211', target: 'P' },
  ]);

  get nodes(): Signal<MachineTopologyNodes> {
    return this._nodes.asReadonly();
  }

  get links(): Signal<TopologyLinks> {
    return this._links.asReadonly();
  }

  updateNodes(node: MachineTopologyNode): void {
    this._nodes.update((nodes) => [...nodes, node]);
  }

  updateLinks(link: TopologyLink): void {
    this._links.update((links) => [...links, link]);
  }

  removeNode(id: string): void {
    this._nodes.update((nodes) => nodes.filter((node) => node.id !== id));
    this._links.update((links) =>
      links.filter((link) => link.source !== id && link.target !== id),
    );
  }

  uniqueIdValidator(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const id = control.value;
      const isUsed = this._nodes().some((node) => node.id === id);
      return isUsed ? { nonUniqueNodeId: true } : null;
    };
  }

  getFreeTargetIds(): Array<string> {
    return this._nodes()
      .map((node) => node.id)
      .filter((id) => !this._links().some((link) => link.target === id));
  }
}
