declare module 'dnd-multi-backend' {
  import {BackendFactory} from 'dnd-core';

  export interface Transition {
    event: string;
    check: (event: Event) => boolean;
  }

  export type BackendTransition = {
    backend: BackendFactory;
    transition: Transition;
    preview?: boolean;
  };
  // const MultiBackend: (
  //   transition: { backends: BackendTransition[] }
  // ) => BackendFactory;
  const MultiBackendFactory: BackendFactory;
  // noinspection JSDuplicatedDeclaration // TODO: Why we need this?
  export default MultiBackendFactory;
  export const createTransition: (
    event: string,
    check: (event: Event) => boolean
  ) => Transition;
  export const HTML5DragTransition: Transition;
  export const TouchTransition: Transition;
  export const MouseTransition: Transition;
}
