import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {DndTreeItemDirective} from './directives/dnd-tree-item.directive';
import {AngularDndCoreModule} from '@angular-dnd/core';
import {AngularDndSortableModule} from '@angular-dnd/sortable';
import {AngularDndTreeListComponent} from './components/angular-dnd-tree-list.component';
import {AngularDndTreeItemComponent} from './components/angular-dnd-tree-item.component';
import {AngularDndTreeComponent, DragPreviewTemplateDirective, TreeItemTemplateDirective} from './components/angular-dnd-tree.component';

const EXPORTS = [
  AngularDndTreeComponent,
  AngularDndTreeListComponent,
  AngularDndTreeItemComponent,
  TreeItemTemplateDirective,
  DragPreviewTemplateDirective,
  // DndTreeItemDirective,
];

@NgModule({
  imports: [
    CommonModule,
    AngularDndCoreModule,
    AngularDndSortableModule,
  ],
  declarations: [
    ...EXPORTS,
    // DndTreeItemComponent,
  ],
  exports: EXPORTS,
})
export class AngularDndTreeModule {
}
