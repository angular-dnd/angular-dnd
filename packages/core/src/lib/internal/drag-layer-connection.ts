import { Subscription, Observable, BehaviorSubject, TeardownLogic } from 'rxjs';
import { DragDropManager, Unsubscribe } from 'dnd-core';
import { DragLayer } from '@sneat-dnd/core';
import { IDragLayerMonitor } from '@sneat-dnd/core';
import { areCollectsEqual } from '../utils/areCollectsEqual';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { scheduleMicroTaskAfter } from './scheduleMicroTaskAfter';

export class DragLayerConnectionClass implements DragLayer {

  unsubscribeFromOffsetChange: Unsubscribe;
  unsubscribeFromStateChange: Unsubscribe;
  private readonly collector$: BehaviorSubject<IDragLayerMonitor>;
  private subscription = new Subscription();


  constructor(private manager: DragDropManager, private zone: Zone) {
    const monitor = this.manager.getMonitor();
    this.collector$ = new BehaviorSubject<IDragLayerMonitor>(monitor);
    this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(
      this.handleOffsetChange
    );
    this.unsubscribeFromStateChange = monitor.subscribeToStateChange(
      this.handleStateChange
    );

    this.subscription.add(() => {
      this.unsubscribeFromOffsetChange();
      this.unsubscribeFromStateChange();
    });

    this.handleStateChange();
  }

  isTicking = false;

  private handleStateChange = () => {
    const monitor = this.manager.getMonitor() as IDragLayerMonitor;
    this.collector$.next(monitor);
  }
  private handleOffsetChange = () => {
    const monitor = this.manager.getMonitor() as IDragLayerMonitor;
    this.collector$.next(monitor);
  }

  listen<P>(mapFn: (monitor: IDragLayerMonitor) => P): Observable<P> {
    return this.collector$.pipe(
      map(mapFn),
      distinctUntilChanged(areCollectsEqual),
      scheduleMicroTaskAfter(this.zone)
    );
  }

  unsubscribe() {
    this.collector$.complete();
    this.subscription.unsubscribe();
  }

  add(teardown: TeardownLogic): Subscription {
    return this.subscription.add(teardown);
  }

  get closed() {
    return this.subscription.closed;
  }

}

