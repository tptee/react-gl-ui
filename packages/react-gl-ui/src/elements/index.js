// @flow

import type { Props } from '../types';
import type Container from '../container';
import RectElement from './rect';

export { RectElement };

export function createInstance(
  type: string,
  props: Props,
  container: Container<*>
): RectElement | null {
  switch (type) {
    case 'rect': {
      return new RectElement(props, container);
    }
    default: {
      return null;
    }
  }
}
