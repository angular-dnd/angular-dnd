import {Directive, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';
import {AngularDndService} from '@angular-dnd/core';
import {IDragSource} from '@sneat-dnd/core';
import {DraggedItem, Size, SortableSpec} from '../types';

export const EXTERNAL_LIST_ID: symbol = Symbol('EXTERNAL_LIST_ID');

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ssExternal]',
  exportAs: 'ssExternal'
})
export class AngularDndSortableExternalDirective<Data> implements OnChanges, OnDestroy {
  @Input('ssExternal') spec!: SortableSpec<Data>;

  /* This source has beginDrag and endDrag implemented in line with what ssRender does.
   *
   * You must, like ssRender, attach it with [dragSource] somewhere.
   */
  public source: IDragSource<DraggedItem<Data>>;

  /* @ignore */
  constructor(
    private dnd: AngularDndService,
    private el: ElementRef<Element>
  ) {
    this.source = this.dnd.dragSource<DraggedItem<Data>>(null, {
      canDrag: monitor => {
        if (this.spec && this.spec.canDrag) {
          // beginDrag has not been called yet, so there is no data, and this is not part of a list.
          // you should be able to decide canDrag without these anyway.
          return this.spec.canDrag(undefined as any, undefined, monitor);
        }
        return true;
      },
      beginDrag: () => {
        if (typeof this.spec.createData !== 'function') {
          throw new Error('spec.createData must be a function');
        }
        return {
          type: this.spec.type,
          data: this.spec.createData(),
          hover: {index: -1, listId: EXTERNAL_LIST_ID},
          isInternal: false,
          index: -1,
          listId: EXTERNAL_LIST_ID,
          size: this.size(),
        };
      },
      endDrag: monitor => {
        const item = monitor.getItem();
        if (item) {
          // tslint:disable-next-line:no-unused-expression
          this.spec && this.spec.endDrag && this.spec.endDrag(item, monitor); // TODO: Check lint warning
        }
      }
    });
  }

  /* @ignore */
  private size() {
    const r = this.el.nativeElement.getBoundingClientRect();
    return new Size(r.width || r.right - r.left, r.height || r.bottom - r.top);
  }

  /* @ignore */
  ngOnChanges() {
    this.source.setType(this.spec.type);
  }

  /* @ignore */
  ngOnDestroy() {
    this.source.unsubscribe();
  }

}
