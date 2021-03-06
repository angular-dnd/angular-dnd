import {DragSource} from 'dnd-core';
import {IDragSourceSpec} from '@sneat-dnd/core';
import {IDragSourceMonitor} from '@sneat-dnd/core';

export class Source implements DragSource {
  constructor(
    private spec: IDragSourceSpec<any>,
    private zone: Zone,
    private monitor: IDragSourceMonitor<any, any>,
  ) {
  }

  withChangeDetection<T>(fn: () => T): T {
    const x = fn();
    this.zone.scheduleMicroTask('DragSource', () => {
    });
    return x;
  }

  canDrag() {
    if (!this.spec.canDrag) {
      return true;
    }

    return this.withChangeDetection(() => {
      return this.spec.canDrag && this.spec.canDrag(this.monitor) || false;
    });
  }

  isDragging(globalMonitor: any, sourceId: any) {
    if (!this.spec.isDragging) {
      return sourceId === globalMonitor.getSourceId();
    }

    return this.spec.isDragging(this.monitor);
  }

  beginDrag() {
    return this.withChangeDetection(() => {
      return this.spec.beginDrag(this.monitor);
    });
  }

  endDrag() {
    if (!this.spec.endDrag) {
      return;
    }

    return this.withChangeDetection(() => {
      if (this.spec.endDrag) {
        this.spec.endDrag(this.monitor);
      }
    });
  }
}

export function createSourceFactory(spec: IDragSourceSpec<any>, zone: Zone) {
  return function createSource(monitor: IDragSourceMonitor): DragSource {
    return new Source(spec, zone, monitor);
  };
}
