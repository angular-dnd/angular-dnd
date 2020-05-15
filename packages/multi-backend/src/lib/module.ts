import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularDndPreviewComponent} from './preview.component';
import {AngularDndPreviewRendererComponent} from './preview-renderer.component';

/** @ignore */
const EXPORTS = [
  AngularDndPreviewComponent,
  AngularDndPreviewRendererComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: EXPORTS,
  exports: EXPORTS,
})
export class AngularDndMultiBackendModule {
}
