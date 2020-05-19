import {NgModule} from '@angular/core';
import {AngularDndSortableDirective} from './directives/sortable.directive';
import {AngularDndSortableListComponent} from './directives/list.component';
import {AngularDndSortableTemplateDirective} from './directives/template.directive';
import {AngularDndSortableRendererDirective} from './directives/render.directive';
import {AngularDndSortableExternalDirective} from './directives/external.directive';
import {CommonModule} from '@angular/common';
import {AngularDndCoreModule} from '@angular-dnd/core';

/** @ignore */
const EXPORTS = [
  AngularDndSortableDirective,
  AngularDndSortableListComponent,
  AngularDndSortableTemplateDirective,
  AngularDndSortableRendererDirective,
  AngularDndSortableExternalDirective,
];

@NgModule({
  declarations: EXPORTS,
  exports: EXPORTS,
  imports: [
    CommonModule,
    AngularDndCoreModule,
  ],
})
export class AngularDndSortableModule {
}
