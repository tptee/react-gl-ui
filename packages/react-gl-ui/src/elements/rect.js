// @flow
/* eslint-disable no-magic-numbers */
import type { Element } from '../interfaces';

import type Container from '../container';

// prettier-ignore
const getVertices = (width, height) => [
  [0, 0],
  [0, height],
  [width, 0],
  [width, 0],
  [width, height],
  [0, height]
];

type Props = {
  width: number,
  height: number
};

export default class RectElement
  implements Element<Props, Container<*>, Array<mixed>> {
  rootContainer: Container<*>;
  draw: Function;

  constructor(props: Object, rootContainer: Container<*>) {
    this.rootContainer = rootContainer;
    const { regl } = this.rootContainer;

    // TODO: factor this out into:
    // - get projection/viewport function
    // - draw call inside of a new primitives/ folder
    this.draw = regl({
      context: {
        // prettier-ignore
        projection: ({ viewportWidth, viewportHeight, pixelRatio }) => [
          2 / viewportWidth * pixelRatio, 0, 0,
          0, -2 / viewportHeight * pixelRatio, 0,
          -1, 1, 1
        ]
      },
      viewport: ({ viewportWidth, viewportHeight }) => ({
        x: 0,
        y: 0,
        width: viewportWidth,
        height: viewportHeight
      }),

      frag: `
      void main() {
        gl_FragColor = vec4(1, 0.5, 0, 1);
      }`,

      vert: `
      attribute vec2 position;

      uniform mat3 projection;

      void main() {
        gl_Position = vec4((projection * vec3(position, 1)).xy, 0, 1);
      }`,

      attributes: {
        position: regl.prop('position')
      },

      uniforms: {
        projection: regl.context('projection')
      },

      count: 6
    });

    regl.frame(() =>
      this.draw({
        position: getVertices(props.width, props.height)
      })
    );
  }

  commitMount() {}

  commitUpdate(
    updatePayload: Array<mixed>,
    oldProps: Object,
    newProps: Object
  ) {
    this.rootContainer.regl.frame(() =>
      this.draw({
        position: getVertices(newProps.width, newProps.height)
      })
    );
  }

  getPublicInstance() {
    return this;
  }

  prepareUpdate() {
    return ['forceCommit', true];
  }

  appendChild() {}
  insertBefore() {}
  removeChild() {}
}
