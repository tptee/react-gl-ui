// @flow

import type { Element, Component } from 'react';
import type { FiberRoot } from 'react-dom/lib/ReactFiberRoot';

import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import createREGL from 'regl';

import HostConfig from './host-config';
import Container from './container';
import resizeCanvas from './util/resize-canvas';

export const GLUIRenderer = new ReactFiberReconciler(HostConfig);

type Fiber = {|
  container: ?Container<*>,
  root: ?FiberRoot,
  regl: ?Function,
  canvas: ?HTMLCanvasElement,

  renderSubtreeIntoContainer: (
    parentComponent: ?Component<*, *, *>,
    element: Element<*>,
    canvas: HTMLCanvasElement
  ) => void,
  render: (element: Element<*>, canvas: HTMLCanvasElement) => void,
  reset: () => void
|};

export const GLUIFiber: Fiber = {
  container: null,
  root: null,
  regl: null,
  canvas: null,

  renderSubtreeIntoContainer(parentComponent, element, callback) {
    if (this.root) {
      GLUIRenderer.updateContainer(
        element,
        this.root,
        parentComponent,
        callback
      );
    } else {
      resizeCanvas(this.canvas);
      this.regl = createREGL({ canvas: this.canvas });
      this.container = new Container(this.regl);
      this.root = GLUIRenderer.createContainer(this.container);
      GLUIRenderer.updateContainer(
        element,
        this.root,
        parentComponent,
        callback
      );
    }
  },

  render(element, canvas, callback) {
    this.canvas = canvas;
    return this.renderSubtreeIntoContainer(null, element, callback);
  },

  reset() {
    delete this.regl;
    delete this.container;
    delete this.root;
  }
};
