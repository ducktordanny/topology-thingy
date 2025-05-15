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

  addNewNode(node: MachineTopologyNode, link: TopologyLink | null): void {
    this._nodes.update((nodes) => [...nodes, node]);
    if (link) this.addNewLink(link);
  }

  addNewLink(link: TopologyLink): void {
    this._links.update((links) => [...links, link]);
  }

  updateNode(
    id: string,
    newNode: MachineTopologyNode,
    newLink: TopologyLink | null,
  ): void {
    this._nodes.update((nodes) =>
      nodes.map((node) => (node.id === id ? newNode : node)),
    );
    this.updateLink(id, newNode.id, newLink);
  }

  updateLink(
    oldSource: string,
    newSource: string,
    newLink: TopologyLink | null,
  ): void {
    this._links.update((links) =>
      links
        .map((link) => {
          if (link.target === oldSource) return { ...link, target: newSource };
          if (link.source === oldSource)
            return newLink ? newLink : { ...link, source: newSource };
          return link;
        })
        .filter((link) => !(link.source === newSource && newLink === null)),
    );
    if (newLink) this._links.update((links) => [...links, newLink]);
  }

  removeNode(id: string): void {
    this._nodes.update((nodes) => nodes.filter((node) => node.id !== id));
    this._links.update((links) =>
      links.filter((link) => link.source !== id && link.target !== id),
    );
  }

  getFreeTargetIds(editedId?: string): Array<string> {
    return this._nodes()
      .map((node) => node.id)
      .filter(
        (id) =>
          !this._links().some(
            (link) => link.target === id && link.source !== editedId,
          ) && id !== editedId,
      );
  }

  getTargetBySource(id: string): string | null {
    return this._links().find((link) => link.source === id)?.target || null;
  }

  uniqueIdValidator(editedId?: string): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const id = control.value;
      const isUsed = this._nodes().some(
        (node) => node.id !== editedId && node.id === id,
      );
      return isUsed ? { nonUniqueNodeId: true } : null;
    };
  }
}
