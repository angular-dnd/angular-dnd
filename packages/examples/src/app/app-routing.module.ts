import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'tree',
    redirectTo: 'tree/basic',
  },
  {
    path: 'tree/basic',
    loadChildren: () => import('./pages/tree-basic/tree-basic-page.module').then( m => m.TreeBasicPageModule)
  },
  {
    path: 'tree/lines',
    loadChildren: () => import('./pages/tree-lines/tree-lines-page.module').then( m => m.TreeLinesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
