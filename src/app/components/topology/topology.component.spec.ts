import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopologyComponent } from './topology.component';

describe('TopologyComponent', () => {
  let fixture: ComponentFixture<TopologyComponent>;
  let component: TopologyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopologyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopologyComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () =>
    expect(component).toBeInstanceOf(TopologyComponent));
});
