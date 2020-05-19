import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TreePageRoutingModule} from './tree-routing.module';

import {TreePage} from './tree.page';
import {AngularDndCoreModule} from '@angular-dnd/core';
import {AngularDndTreeModule} from '@angular-dnd/tree';
import {AngularDndSortableModule} from '@angular-dnd/sortable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreePageRoutingModule,
    AngularDndCoreModule,
    AngularDndSortableModule,
    AngularDndTreeModule,
  ],
  declarations: [TreePage]
})
export class TreePageModule {
}
