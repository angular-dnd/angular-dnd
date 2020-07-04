import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularDndPreviewComponent} from './preview.component';
import {AngularDndPreviewRendererComponent} from './preview-renderer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AngularDndPreviewComponent,
    AngularDndPreviewRendererComponent,
  ],
  exports: [
    AngularDndPreviewComponent,
    AngularDndPreviewRendererComponent,
  ],
})
export class AngularDndMultiBackendModule {
}
