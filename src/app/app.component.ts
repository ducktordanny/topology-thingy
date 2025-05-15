import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TopologyComponent } from './components/topology/topology.component';
import { FakeApiService } from './services/fake-api.service';
import { NodeFormComponent } from './components/node-form/node-form.component';
import { TopologyNode } from './components/topology/topology.type';

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
    this.dialog.open(NodeFormComponent);
  }

  protected showDetails(node: TopologyNode): void {
    this.dialog.open(NodeFormComponent, { data: node });
  }
}
