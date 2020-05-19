// import no symbols to get typings but not execute the monkey-patching module loader
// tslint:disable-next-line:no-reference
/// <reference path="ambient.d.ts" />

export {
  AngularDndCoreModule,
  BackendInput,
  BackendFactoryInput,
} from './lib/dnd.module';

export {DragSourceMonitor} from './lib/source-monitor';
export {DropTargetMonitor} from './lib/target-monitor';
export {DragLayerMonitor} from './lib/layer-monitor';

// the source, target and preview types
export {DropTarget, DragSource, DragLayer} from './lib/connection-types';

export {DragSourceOptions, DragPreviewOptions} from './lib/connectors';

export {DRAG_DROP_BACKEND, DRAG_DROP_MANAGER} from './lib/tokens';

// direct API
export {AngularDndService, AddSubscription} from './lib/connector.service';
export {DropTargetSpec} from './lib/drop-target-specification';
export {DragSourceSpec} from './lib/drag-source-specification';

export {
  DndDirective,
  DragSourceDirective,
  DropTargetDirective,
  DragPreviewDirective,
} from './lib/dnd.directive';

export {Offset} from './lib/type-ish';
