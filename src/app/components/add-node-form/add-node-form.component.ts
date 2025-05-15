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
import { AddNodeFormGroup } from './add-node-form.type';
import { FakeApiService } from '../../services/fake-api.service';
import { TopologyLink } from '../topology/topology.type';

@Component({
  selector: 'app-add-node-form',
  templateUrl: 'add-node-form.template.html',
  styleUrl: 'add-node-form.style.scss',
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
export class AddNodeFormComponent {
  private readonly fakeApiService = inject(FakeApiService);
  private readonly dialogRef = inject(DialogRef);

  protected readonly MachineStatus = MachineStatus;
  protected readonly formGroup = new FormGroup<AddNodeFormGroup>({
    id: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        this.fakeApiService.uniqueIdValidator(),
      ],
    }),
    owner: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    version: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<MachineStatus>(MachineStatus.UNKNOWN, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    target: new FormControl<string | null>(null),
  });
  protected availableTargets = signal<Array<string>>([]);

  constructor() {
    this.availableTargets.set(this.fakeApiService.getFreeTargetIds());
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const formData = this.formGroup.getRawValue();
    const machineTopologyNode: MachineTopologyNode = {
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
    this.fakeApiService.updateNodes(machineTopologyNode);
    if (formData.target) {
      const topologyLink: TopologyLink = {
        source: formData.id,
        target: formData.target,
      };
      this.fakeApiService.updateLinks(topologyLink);
    }
    this.dialogRef.close();
  }
}
