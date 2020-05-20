/*
 * Public API Surface of multi-backend
 */
// TODO: move this to another package, in the `dnd-multi-backend` monorepo.

// tslint:disable-next-line:no-reference
/// <reference path="ambient.d.ts" />
export {default as TouchBackend} from 'react-dnd-touch-backend';
export {default as HTML5Backend} from 'react-dnd-html5-backend';
export {
  default as MultiBackend,
  createTransition,
  HTML5DragTransition,
  TouchTransition,
  MouseTransition,
} from 'dnd-multi-backend';

export {HTML5ToTouch, defaultMultiBackendFactory, createDefaultMultiBackendFactory} from './lib/HTML5ToTouch';
export {AngularDndMultiBackendModule} from './lib/module';
export {AngularDndPreviewComponent} from './lib/preview.component';
export {AngularDndPreviewRendererComponent} from './lib/preview-renderer.component';
