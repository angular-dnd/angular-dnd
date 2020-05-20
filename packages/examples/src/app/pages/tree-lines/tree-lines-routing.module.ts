import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreeLinesPage } from './tree-lines-page.component';

const routes: Routes = [
  {
    path: '',
    component: TreeLinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeLinesPageRoutingModule {}
