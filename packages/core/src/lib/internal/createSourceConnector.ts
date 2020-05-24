import {Backend, Identifier} from 'dnd-core';
import {IDragPreviewOptions, IDragSourceConnector, IDragSourceOptions} from '@sneat-dnd/core';
import {Reconnector} from './Reconnector';

export interface Connector<TConnector> {
  hooks: TConnector;

  receiveHandlerId(handlerId: Identifier | null): void;

  reconnect(): void;
}

export class SourceConnector implements Connector<IDragSourceConnector> {
  private currentHandlerId: any;

  private dragSource = new Reconnector<IDragSourceOptions>(
    (handlerId, node, options) => {
      return this.backend.connectDragSource(handlerId, node, options);
    }
  );
  private dragPreview = new Reconnector<IDragPreviewOptions>(
    (handlerId, node, options) => {
      return this.backend.connectDragPreview(handlerId, node, options);
    }
  );

  public hooks: IDragSourceConnector = { // TODO: Can we make it readonly? If not document why.
    dragSource: this.dragSource.hook,
    dragPreview: this.dragPreview.hook,
  };

  constructor(private backend: Backend) {
  }

  public receiveHandlerId(handlerId: Identifier | null) {
    if (handlerId === this.currentHandlerId) {
      return;
    }
    this.currentHandlerId = handlerId;
    this.dragSource.reconnect(handlerId);
    this.dragPreview.reconnect(handlerId);
  }

  public reconnect() {
    this.dragSource.reconnect(this.currentHandlerId);
    this.dragPreview.reconnect(this.currentHandlerId);
  }
}

export default function createSourceConnector(backend: Backend) {
  return new SourceConnector(backend);
}
