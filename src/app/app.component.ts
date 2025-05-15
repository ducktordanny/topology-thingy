import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TopologyNode } from './components/topology/topology.type';
import { TopologyComponent } from './components/topology/topology.component';
import { FakeApiService } from './services/fake-api.service';
import { AddNodeFormComponent } from './components/add-node-form/add-node-form.component';

@Component({
  selector: 'app-root',
  imports: [TopologyComponent, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly fakeApiService = inject(FakeApiService);
  private readonly dialog = inject(MatDialog);

  protected onAddNode() {
    this.dialog.open(AddNodeFormComponent, {});
  }

  protected showDetails(node: TopologyNode): void {
    console.log(node);
  }
}
