import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreeBasicPage } from './tree-basic-page.component';

const routes: Routes = [
  {
    path: '',
    component: TreeBasicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeBasicPageRoutingModule {}
