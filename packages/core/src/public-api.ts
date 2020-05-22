// import no symbols to get typings but not execute the monkey-patching module loader
// tslint:disable-next-line:no-reference
/// <reference path="ambient.d.ts" />

export {
  AngularDndCoreModule,
  BackendInput,
  BackendFactoryInput,
} from './lib/dnd.module';

export {IDragSourceMonitor} from '@sneat-team/dnd-core';
export {IDropTargetMonitor} from '@sneat-team/dnd-core';
export {IDragLayerMonitor} from '@sneat-team/dnd-core';

// the source, target and preview types
export {DropTarget, DragSource, DragLayer} from '@sneat-team/dnd-core';

export {DragSourceOptions, DragPreviewOptions} from '@sneat-team/dnd-core';

export {DRAG_DROP_BACKEND, DRAG_DROP_MANAGER} from './lib/tokens';

// direct API
export {AngularDndService, AddSubscription} from './lib/connector.service';
export {IDropTargetSpec} from '@sneat-team/dnd-core';
export {IDragSourceSpec} from '@sneat-team/dnd-core';

export {
  DndDirective,
  DragSourceDirective,
  DropTargetDirective,
  DragPreviewDirective,
} from './lib/dnd.directive';

export {Offset} from './lib/type-ish';
