import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {AngularDndService} from '@angular-dnd/core';
// @ts-ignore
import {AngularDndSortableTemplateDirective, TemplateContext} from './template.directive';
import {AngularDndSortableDirective} from './sortable.directive';

@Component({
  selector: 'angular-dnd-sortable-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngFor="let card of children;
                          let i = index;
                          trackBy: trackById">
      <ng-container *ngTemplateOutlet="template;
            context: {
                $implicit: contextFor(card, i)
            }">
      </ng-container>
    </ng-container>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  // allow injecting the directive and getting the component
  providers: [{
    provide: AngularDndSortableDirective,
    useExisting: AngularDndSortableListComponent
  }]
})
export class AngularDndSortableListComponent<Data>
  extends AngularDndSortableDirective<Data>
  implements OnDestroy, OnChanges, AfterContentInit, AfterViewInit {
  @Input('ssTemplate') template?: TemplateRef<TemplateContext<Data>>;

  /** @ignore */
  @ContentChildren(AngularDndSortableTemplateDirective, {
    read: TemplateRef
  })
  set ssRenderTemplates(ql: QueryList<TemplateRef<TemplateContext<Data>>>) {
    if (ql.length > 0) {
      this.template = ql.first;
    }
  };

  /** @ignore */
  constructor(
    dnd: AngularDndService,
    el: ElementRef<HTMLElement>,
    cdr: ChangeDetectorRef,
  ) {
    super(dnd, el, cdr);
  }

  /** @ignore */
  trackById = (_: number, data: Data) => {
    return this.spec && this.spec.trackBy(data);
  };

  /** @ignore */
  ngAfterContentInit() {
    if (!this.template) {
      throw new Error('You must provide a <ng-template cardTemplate> as a content child, or with [template]="myTemplateRef"');
    }
  }

  // forwarding lifecycle events is required until Ivy renderer

  /** @ignore */
  ngOnInit() {
    super.ngOnInit();
  }

  /** @ignore */
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  /** @ignore */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  /** @ignore */
  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
