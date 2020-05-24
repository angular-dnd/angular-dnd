import {AngularDndService} from '@angular-dnd/core';
import {IDropTarget} from '@sneat-dnd/core';
import {DraggedItem} from './types';
import {Subject} from 'rxjs';
import {distinctUntilChanged, filter} from 'rxjs/operators';

export const SPILLED_LIST_ID: symbol = Symbol('SPILLED_LIST_ID');

export interface SpillConfiguration<Data> {
  drop?: (item: DraggedItem<Data>) => void;
  hover?: (item: DraggedItem<Data>) => void;
}

export function spillTarget<Data>(
  dnd: AngularDndService,
  types: string | symbol | Array<string | symbol> | null,
  config: SpillConfiguration<Data>,
): IDropTarget<DraggedItem<Data>> {

  const mutate = (item: DraggedItem<Data> | null) => {
    if (!item) {
      return null;
    }
    item.hover = {listId: SPILLED_LIST_ID, index: -1};
    return {...item};
  };

  const hover$ = new Subject<DraggedItem<Data> | null>();

  const target = dnd.dropTarget<DraggedItem<Data>>(types, {
    hover: monitor => {
      if (monitor.canDrop() && monitor.isOver({shallow: true})) {
        const item = mutate(monitor.getItem());
        hover$.next(item);
      } else {
        hover$.next(null);
      }
    },
    drop: config.drop && (monitor => {
      const item = mutate(monitor.getItem());
      if (!monitor.didDrop()) {
        // tslint:disable-next-line:no-unused-expression
        config.drop && item && config.drop(item); // TODO: check & fix lint warning
      }
    }) || undefined
  });

  const spilled$ = hover$
    .pipe(distinctUntilChanged(), filter(a => !!a));

  const subs = spilled$.subscribe((item) => {
    // tslint:disable-next-line:no-unused-expression
    config.hover && item && config.hover(item); // TODO: check & fix lint warning
  });

  target.add(subs);
  return target;
}
