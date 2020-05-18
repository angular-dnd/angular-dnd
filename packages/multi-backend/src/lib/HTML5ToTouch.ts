import {default as HTML5Backend} from 'react-dnd-html5-backend';
import {default as TouchBackend} from 'react-dnd-touch-backend';
import {BackendTransition, default as MultiBackendFactory, MouseTransition, TouchTransition} from 'dnd-multi-backend';
import {BackendFactory} from 'dnd-core';

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

export const defaultMultiBackendFactory: BackendFactory = (manager, ctx?: any) => MultiBackendFactory(manager, ctx, HTML5ToTouch);
