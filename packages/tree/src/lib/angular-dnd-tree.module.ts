import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularDndCoreModule} from '@angular-dnd/core';
import {AngularDndTreeListComponent} from './components/angular-dnd-tree-list.component';
import {AngularDndTreeItemComponent} from './components/angular-dnd-tree-item.component';
import {AngularDndTreeComponent, DragPreviewTemplateDirective, TreeItemTemplateDirective} from './components/angular-dnd-tree.component';
import {AngularDndExternalTreeItemDirective} from './directives/dnd-external-item.directive';

const EXPORTS = [
  AngularDndTreeComponent,
  AngularDndTreeListComponent,
  AngularDndTreeItemComponent,
  TreeItemTemplateDirective,
  DragPreviewTemplateDirective,
  AngularDndExternalTreeItemDirective,
];

@NgModule({
  imports: [
    CommonModule,
    AngularDndCoreModule,
  ],
  declarations: [
    ...EXPORTS,
  ],
  exports: EXPORTS,
})
export class AngularDndTreeModule {
}
