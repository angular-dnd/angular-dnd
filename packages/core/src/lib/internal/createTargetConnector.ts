import {Backend, Identifier} from 'dnd-core';
import {DropTargetConnector} from '@sneat-dnd/core';
import {Connector} from './createSourceConnector';
import {Reconnector} from './Reconnector';

export class TargetConnector implements Connector<DropTargetConnector> {
  private currentHandlerId: any;

  private dropTarget = new Reconnector<void>(
    (handlerId, node, options) => {
      return this.backend.connectDropTarget(handlerId, node, options);
    }
  );

  public hooks: DropTargetConnector = {
    dropTarget: this.dropTarget.hook
  };

  constructor(private backend: Backend) {
  }

  public receiveHandlerId(handlerId: Identifier | null) {
    if (handlerId === this.currentHandlerId) {
      return;
    }
    this.currentHandlerId = handlerId;
    this.dropTarget.reconnect(handlerId);
  }

  public reconnect() {
    this.dropTarget.reconnect(this.currentHandlerId);
  }
}

export default function createTargetConnector(backend: Backend) {
  return new TargetConnector(backend);
}
