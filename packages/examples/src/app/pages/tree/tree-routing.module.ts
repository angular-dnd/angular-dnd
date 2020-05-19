import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreePage } from './tree.page';

const routes: Routes = [
  {
    path: '',
    component: TreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreePageRoutingModule {}
