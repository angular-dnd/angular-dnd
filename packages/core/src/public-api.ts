export {
  AngularDndCoreModule,
  BackendInput,
  BackendFactoryInput,
} from './lib/dnd.module';

export {IDragSourceMonitor} from '@sneat-dnd/core';
export {IDropTargetMonitor} from '@sneat-dnd/core';
export {IDragLayerMonitor} from '@sneat-dnd/core';

// the source, target and preview types
export {IDropTarget, IDragSource, IDragLayer} from '@sneat-dnd/core';

export {IDragSourceOptions, IDragPreviewOptions} from '@sneat-dnd/core';

export {DRAG_DROP_BACKEND, DRAG_DROP_MANAGER} from './lib/tokens';

// direct API
export {AngularDndService, AddSubscription} from './lib/connector.service';
export {IDropTargetSpec} from '@sneat-dnd/core';
export {IDragSourceSpec} from '@sneat-dnd/core';

export {
  DndDirective,
  DragSourceDirective,
  DropTargetDirective,
  DragPreviewDirective,
} from './lib/dnd.directive';

export {Offset} from './lib/type-ish';
