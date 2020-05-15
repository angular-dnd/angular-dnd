import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {DndTreeItemDirective} from './directives/dnd-tree-item.directive';
import {AngularDndModule} from '@angular-dnd/core';
import {AngularDndSortableModule} from '@angular-dnd/sortable';
import {DndTreeListComponent} from './components/dnd-tree-list.component';
import {DndTreeItemComponent} from './components/dnd-tree-item.component';
import {DndTreeComponent, DragPreviewTemplateDirective, TreeItemTemplateDirective} from './components/dnd-tree.component';

const EXPORTS = [
  DndTreeComponent,
  DndTreeListComponent,
  DndTreeItemComponent,
  TreeItemTemplateDirective,
  DragPreviewTemplateDirective,
  // DndTreeItemDirective,
];

@NgModule({
  imports: [
    CommonModule,
    AngularDndModule,
    AngularDndSortableModule,
  ],
  declarations: [
    ...EXPORTS,
    // DndTreeItemComponent,
  ],
  exports: EXPORTS,
})
export class DndTreeModule {
}
