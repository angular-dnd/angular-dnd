import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TreeLinesPageRoutingModule} from './tree-lines-routing.module';

import {TreeLinesPage} from './tree-lines-page.component';
import {AngularDndService} from '@angular-dnd/core';
import {AngularDndTreeModule} from '@angular-dnd/tree';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreeLinesPageRoutingModule,
    AngularDndTreeModule,
  ],
  declarations: [TreeLinesPage],
  providers: [
    AngularDndService,
  ]
})
export class TreeLinesPageModule {
}
