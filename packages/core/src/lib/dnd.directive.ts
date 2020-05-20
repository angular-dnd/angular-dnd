import {Directive, ElementRef, Input, NgZone} from '@angular/core';
import {OnChanges} from '@angular/core';
import {OnDestroy} from '@angular/core';

import {invariant} from './internal/invariant';

import {DragSource, DropTarget} from './connection-types';
import {DragPreviewOptions, DragSourceOptions} from './connectors';
import {Subscription} from 'rxjs';
import {TypeOrTypeArray} from './type-ish';

/** @ignore */
const explanation =
  'You can only pass exactly one connection object to [dropTarget]. ' +
  'There is only one of each source/target/preview allowed per DOM element.'
;

/**
 * @ignore
 */
@Directive({
  selector: '[angularDndDirective]'
})
export class DndDirective implements OnChanges, OnDestroy { // TODO: Mark as abstract class?
  protected connection: any;
  private deferredRequest = new Subscription();

  /** @ignore */
  constructor(
    protected elRef: ElementRef,
    private zone: NgZone,
  ) {
  }

  public ngOnChanges() {
    invariant(
      typeof this.connection === 'object' && !Array.isArray(this.connection),
      explanation
    );
    this.zone.runOutsideAngular(() => {
      // discard an unresolved connection request
      // in the case where the previous one succeeded, deferredRequest is
      // already closed.
      this.deferredRequest.unsubscribe();
      // replace it with a new one
      if (this.connection) {
        this.deferredRequest = this.callHooks(this.connection);
      }
    });
  }

  public ngOnDestroy() {
    this.deferredRequest.unsubscribe();
  }

  // @ts-ignore
  protected callHooks(conn: any): Subscription {
    return new Subscription();
  }
}

// Note: the T | undefined everywhere is from https://github.com/angular/angular-cli/issues/2034

/**
 * Allows you to connect a {@link DropTarget} to an element in a component template.
 */
@Directive({
  selector: '[angularDndDropTarget]'
})
export class DropTargetDirective extends DndDirective implements OnChanges {
  protected connection: DropTarget | undefined;

  /** Which target to connect the DOM to */
  @Input('angularDndDropTarget') public dropTarget!: DropTarget;

  /** Shortcut for setting a type on the connection.
   *  Lets you use Angular binding to do it. Runs {@link DropTarget#setTypes}. */
  @Input('angularDndDropTargetTypes') dropTargetTypes?: TypeOrTypeArray;

  /** Reduce typo confusion by allowing non-plural version of dropTargetTypes */
  @Input('angularDndDropTargetType') set dropTargetType(t: TypeOrTypeArray) {
    this.dropTargetTypes = t;
  }

  public ngOnChanges() {
    this.connection = this.dropTarget;
    if (this.connection && this.dropTargetTypes != null) {
      this.connection.setTypes(this.dropTargetTypes);
    }
    super.ngOnChanges();
  }

  protected callHooks(conn: DropTarget): Subscription {
    return conn.connectDropTarget(this.elRef.nativeElement);
  }
}

/**
 * Allows you to connect a {@link DragSource} to an element in a component template.
 */
@Directive({
  selector: '[angularDndDragSource]'
})
export class DragSourceDirective extends DndDirective implements OnChanges {
  protected connection: DragSource<any> | undefined;

  /* Which source to connect the DOM to */
  @Input('angularDndDragSource') dragSource!: DragSource<any>;

  /* Shortcut for setting a type on the connection.
   * Lets you use Angular binding to do it. Runs {@link DragSource#setType}. */
  @Input('angularDndDragSourceType') dragSourceType?: string | symbol;

  /* Pass an options object as you would to {@link DragSource#connectDragSource}. */
  @Input('angularDndDragSourceOptions') dragSourceOptions?: DragSourceOptions;

  /* Do not render an HTML5 preview. Only applies when using the HTML5 backend.
   * It does not use { captureDraggingState: true } for IE11 support; that is broken. */
  @Input('angularDndNoHTML5Preview') noHTML5Preview = false;

  public ngOnChanges() {
    this.connection = this.dragSource;
    if (this.connection && this.dragSourceType != null) {
      this.connection.setType(this.dragSourceType);
    }
    super.ngOnChanges();
  }

  protected callHooks(conn: DragSource<any>): Subscription {
    const sub = new Subscription();
    sub.add(conn.connectDragSource(this.elRef.nativeElement, this.dragSourceOptions));
    if (this.noHTML5Preview) {
      sub.add(conn.connectDragPreview(getEmptyImage()));
    }
    return sub;
  }

}

/**
 * Allows you to specify which element a {@link DragSource} should screenshot as an HTML5 drag preview.
 *
 * Only relevant when using the HTML5 backend.
 */
@Directive({
  selector: '[angularDndDragPreview]',
  // inputs: ['angularDndDragPreview', 'angularDndDragPreviewOptions']
})
export class DragPreviewDirective extends DndDirective implements OnChanges {
  protected connection: DragSource<any> | undefined;
  /** The drag source for which this element will be the preview. */
  @Input('angularDndDragPreview') public dragPreview!: DragSource<any>;
  /** Pass an options object as you would to {@link DragSource#connectDragPreview}. */
  @Input('angularDndDDragPreviewOptions') dragPreviewOptions?: DragPreviewOptions;

  public ngOnChanges() {
    this.connection = this.dragPreview;
    super.ngOnChanges();
  }

  protected callHooks(conn: DragSource<any>) {
    return conn.connectDragPreview(this.elRef.nativeElement, this.dragPreviewOptions);
  }
}

// import { getEmptyImage } from 'react-dnd-html5-backend';
// we don't want to depend on the backend, so here that is, copied
/** @ignore */
let emptyImage: HTMLImageElement;

/**
 * Returns a 0x0 empty GIF for use as a drag preview.
 * @ignore
 * */
function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }
  return emptyImage;
}

