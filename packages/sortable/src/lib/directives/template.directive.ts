import {Directive} from '@angular/core';
import {RenderContext} from '../types';

export interface TemplateContext<Data> {
  $implicit: RenderContext<Data>;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ssTemplate]'
})
export class AngularDndSortableTemplateDirective {
}
