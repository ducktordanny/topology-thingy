import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

import { drag, DragBehavior, select, Selection, SubjectPosition } from 'd3';

import {
  NodeSize,
  Position,
  TopologyLink,
  TopologyLinks,
  TopologyNode,
  TopologyNodes,
} from './topology.type';
import { getTopologyNodesById } from './topology-nodes-by-id.util';

@Component({
  selector: 'app-topology',
  template: `<svg #topologyElement height="100%" width="100%" />`,
  styleUrl: 'topology.style.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopologyComponent implements AfterViewInit, OnDestroy {
  readonly nodes = input.required<TopologyNodes>();
  readonly links = input.required<TopologyLinks>();
  readonly nodeSize = input<NodeSize>({ width: 100, height: 60 });
  readonly margin = input<number>(10);
  readonly nodeClick = output<TopologyNode>();

  private readonly topologyElement =
    viewChild.required<ElementRef<SVGElement>>('topologyElement');

  private readonly injector = inject(Injector);

  private topology!: Selection<SVGElement, unknown, null, unknown>;
  private linkLines!: Selection<
    SVGLineElement,
    TopologyLink,
    SVGElement,
    unknown
  >;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    effect(
      () => {
        this.nodes();
        this.links();
        if (this.topology) this.topology.selectAll('*').remove();
        this.topology = select(this.topologyElement().nativeElement);
        this.initLinkLines();
        this.drawNodes();
      },
      { injector: this.injector },
    );

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.onResize(width, height);
      }
    });
    this.resizeObserver.observe(this.topologyElement().nativeElement);
  }

  ngOnDestroy(): void {
    select(this.topologyElement().nativeElement)
      .select('svg')
      .selectAll('*')
      .remove();
    this.resizeObserver?.disconnect();
  }

  private get nodeCenterOffset(): Position {
    return {
      x: this.nodeSize().width / 2,
      y: this.nodeSize().height / 2,
    };
  }

  private drawNodes(): void {
    const nodeRects = this.topology
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr(
        'transform',
        (data) => `translate(${data.position.x}, ${data.position.y})`,
      )
      .call(this.handleNodesDragging());
    nodeRects
      .append('rect')
      .classed('node-rect', true)
      .attr('width', this.nodeSize().width)
      .attr('height', this.nodeSize().height)
      .on('click', (_event, data) => {
        this.nodeClick.emit(data);
      });
    nodeRects
      .append('text')
      .text((data) => data.id)
      .attr('x', this.nodeCenterOffset.x)
      .attr('y', this.nodeCenterOffset.y)
      .classed('node-text', true);
  }

  private handleNodesDragging(): DragBehavior<
    SVGGElement,
    TopologyNode,
    TopologyNode | SubjectPosition
  > {
    const that = this;
    return drag<SVGGElement, TopologyNode>()
      .subject((_event, d) => {
        return { x: d.position.x, y: d.position.y };
      })
      .on('drag', function (event, data) {
        const isOverlapping = that.nodes().some((node) => {
          if (node.id === data.id) return false;
          const width = that.nodeSize().width + that.margin();
          const height = that.nodeSize().height + that.margin();
          return !(
            event.x + width < node.position.x ||
            event.y + height < node.position.y ||
            event.x > node.position.x + width ||
            event.y > node.position.y + height
          );
        });

        if (isOverlapping) return;
        data.position.x = event.x;
        data.position.y = event.y;
        select(this).attr(
          'transform',
          `translate(${data.position.x}, ${data.position.y})`,
        );
        that.drawLinkLines();
      });
  }

  private initLinkLines(): void {
    this.linkLines = this.topology
      .selectAll('line')
      .data(this.links())
      .enter()
      .append('line')
      .classed('link', true);
    this.drawLinkLines();
  }

  private drawLinkLines(): void {
    if (this.linkLines === null) return;
    const nodesById = getTopologyNodesById(this.nodes());

    this.linkLines
      .attr(
        'x1',
        (data) => nodesById[data.source].position.x + this.nodeCenterOffset.x,
      )
      .attr(
        'y1',
        (data) => nodesById[data.source].position.y + this.nodeCenterOffset.y,
      )
      .attr(
        'x2',
        (data) => nodesById[data.target].position.x + this.nodeCenterOffset.x,
      )
      .attr(
        'y2',
        (data) => nodesById[data.target].position.y + this.nodeCenterOffset.y,
      );
  }

  private onResize(width: number, height: number): void {
    this.topology
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }
}
