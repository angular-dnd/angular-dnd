import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TreeBasicPageRoutingModule} from './tree-basic-page-routing.module';

import {TreeBasicPage} from './tree-basic-page.component';
import {AngularDndService} from '@angular-dnd/core';
import {AngularDndTreeModule} from '@angular-dnd/tree';
import {AngularDndSortableModule} from '@angular-dnd/sortable';
import {AngularDndCoreModule} from '@angular-dnd/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreeBasicPageRoutingModule,
    AngularDndSortableModule,
    AngularDndTreeModule,
    AngularDndCoreModule,
  ],
  declarations: [TreeBasicPage],
  providers: [
    AngularDndService,
  ]
})
export class TreeBasicPageModule {
}
