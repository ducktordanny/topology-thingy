import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DialogRef } from '@angular/cdk/dialog';

import { MachineStatus, MachineTopologyNode } from '../../types/machine.type';
import { NodeFormGroup } from './node-form.type';
import { FakeApiService } from '../../services/fake-api.service';
import { TopologyLink } from '../topology/topology.type';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-node-form',
  templateUrl: 'node-form.template.html',
  styleUrl: 'node-form.style.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeFormComponent {
  protected readonly dialogData: MachineTopologyNode = inject(MAT_DIALOG_DATA);
  private readonly fakeApiService = inject(FakeApiService);
  private readonly dialogRef = inject(DialogRef);

  protected readonly MachineStatus = MachineStatus;
  protected readonly formGroup = new FormGroup<NodeFormGroup>({
    id: new FormControl<string>(this.dialogData?.id, {
      nonNullable: true,
      validators: [
        Validators.required,
        this.fakeApiService.uniqueIdValidator(this.dialogData?.id),
      ],
    }),
    owner: new FormControl<string>(this.dialogData?.data?.owner, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    version: new FormControl<string>(this.dialogData?.data?.owner, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<MachineStatus>(
      this.dialogData?.data?.status || MachineStatus.UNKNOWN,
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    target: new FormControl<string | null>(
      this.fakeApiService.getTargetBySource(this.dialogData?.id),
    ),
  });
  protected availableTargets = signal<Array<string>>([]);

  constructor() {
    this.availableTargets.set(
      this.fakeApiService.getFreeTargetIds(this.dialogData?.id),
    );
  }

  protected onSubmit(event?: SubmitEvent): void {
    event?.preventDefault();
    const machineTopologyNode = this.getMachineTopologyNodeFromForm();
    const topologyLink = this.getTopologyLinkFromForm();

    if (this.dialogData?.id)
      this.fakeApiService.updateNode(
        this.dialogData.id,
        machineTopologyNode,
        topologyLink,
      );
    else this.fakeApiService.addNewNode(machineTopologyNode, topologyLink);

    this.dialogRef.close();
  }

  protected removeNode(): void {
    if (this.dialogData.id) this.fakeApiService.removeNode(this.dialogData.id);
    this.dialogRef.close();
  }

  private getMachineTopologyNodeFromForm(): MachineTopologyNode {
    const formData = this.formGroup.getRawValue();
    return {
      id: formData.id,
      position: {
        x: 100,
        y: 100,
      },
      data: {
        status: formData.status,
        owner: formData.owner,
        version: formData.version,
      },
    };
  }

  private getTopologyLinkFromForm(): TopologyLink | null {
    const formData = this.formGroup.getRawValue();
    return formData.target
      ? {
          source: formData.id,
          target: formData.target,
        }
      : null;
  }
}
