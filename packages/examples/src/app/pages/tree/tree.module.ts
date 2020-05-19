import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TreePageRoutingModule } from './tree-routing.module';

import { TreePage } from './tree.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreePageRoutingModule
  ],
  declarations: [TreePage]
})
export class TreePageModule {}
