'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RectElement = undefined;
exports.createGLUIInstance = createGLUIInstance;

var _rect = require('./rect');

var _rect2 = _interopRequireDefault(_rect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.RectElement = _rect2.default;

// eslint-disable-next-line max-params

// import type { HostContext } from '../host-config';

function createGLUIInstance(type, props, container
// context: HostContext
) {
  switch (type) {
    case 'rect':
      {
        return new _rect2.default(props, container);
      }
    default:
      {
        return null;
      }
  }
}