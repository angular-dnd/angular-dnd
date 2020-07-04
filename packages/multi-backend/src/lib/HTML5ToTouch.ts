import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import {MouseTransition, TouchTransition} from '@sneat-dnd/multi-backend';
import {multiBackendFactory} from '@sneat-dnd/multi-backend';
import {BackendFactory} from 'dnd-core';
import {BackendTransition} from 'dnd-multi-backend';

export const HTML5ToTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition
    },
    {
      backend: TouchBackend,
      options: {enableMouseEvents: true},
      preview: true,
      transition: TouchTransition
    }
  ] as BackendTransition[]
};

export const defaultMultiBackendFactory: BackendFactory = (manager, ctx?: any) => multiBackendFactory(manager, ctx, HTML5ToTouch);

export function createDefaultMultiBackendFactory(): BackendFactory {
  return defaultMultiBackendFactory;
}
