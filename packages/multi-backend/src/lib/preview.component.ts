/* tslint:disable:jsdoc-format */
import {ChangeDetectionStrategy, Component, ContentChild, Inject, Input, OnDestroy, TemplateRef} from '@angular/core';
import {AngularDndService, DRAG_DROP_MANAGER} from '@angular-dnd/core';
import {DragDropManager} from 'dnd-core';

// @ts-ignore

export interface PreviewTemplateContext {
  /** same as type */
  $implicit: string | symbol;
  type: string | symbol;
  // tslint:disable-next-line:ban-types
  item: Object & any;
}

/**
 * If you pass an `<ng-template let-type let-item="item">` to `<angular-dnd-preview>` as a child,
 * then that template will be rendered so as to follow the mouse around while dragging.
 * What you put in that template is up to you, but in most cases this will be:
 *
 ```html
 <angular-dnd-preview>
 <ng-template let-type let-item="item">
 <ng-content [ngSwitch]="type">
 <!-- one kind of preview per type, using *ngSwitchCase="'TYPE'" -->
 <div *ngSwitchCase="'TYPE'">{{ item | json }}</div>
 </ng-content>
 </ng-template>
 </angular-dnd-preview>
 ```
 */
@Component({
  selector: 'angular-dnd-preview',
  template: `
    <ng-container *ngIf="collect$|async as c">
      <angular-dnd-preview-renderer *ngIf="c.previewEnabled">
        <ng-container *ngIf="c.isDragging">
          <ng-container
            *ngTemplateOutlet="content; context: { $implicit: c.itemType, type: c.itemType, item: c.item }">
          </ng-container>
        </ng-container>
      </angular-dnd-preview-renderer>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AngularDndPreviewComponent implements OnDestroy {
  /** Disables the check for whether the current MultiBackend wants the preview enabled */
  @Input() allBackends = false;

  /** @ignore */
  @ContentChild(TemplateRef, {static: false})
  content!: TemplateRef<PreviewTemplateContext>;

  /** @ignore */
  private layer = this.dndService.dragLayer();

  // we don't need all the fast-moving props here, so this optimises change detection
  // on the projected template's inputs (i.e. the context).
  // the fast-moving stuff is contained in the preview renderer.
  // also, we include this.isPreviewEnabled() because in this component with OnPush,
  // a plain getter isn't checked more than once, and this forces it to be called on each event.
  /** @ignore */
  collect$ = this.layer.listen(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    previewEnabled: this.isPreviewEnabled()
  }));

  /** @ignore */
  warned = false;

  /** @ignore */
  constructor(
    private dndService: AngularDndService,
    @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager,
  ) {
  }

  /** @ignore */
  ngOnDestroy() {
    this.layer.unsubscribe();
  }

  /** @ignore */
  warn(msg: string) {
    if (!this.warned) {
      console.warn(msg);
    }
    this.warned = true;
  }

  /** @ignore */
  isPreviewEnabled() {
    if (this.allBackends) {
      return true;
    }
    if (this.manager == null) {
      this.warn(
        'no drag and drop manager defined, are you sure you imported AngularDndModule?'
      );
      return false;
    }
    const backend = this.manager.getBackend() as any;
    if (backend == null) {
      this.warn(
        'no drag and drop backend defined, are you sure you imported AngularDndModule.forRoot(backend)?'
      );
      return false;
    }
    // for when you are not using dnd-multi-backend
    if (backend.previewEnabled == null) {
      return true;
    }
    return backend.previewEnabled();
  }
}
