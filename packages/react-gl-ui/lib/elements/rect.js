'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RectElement = function () {
  function RectElement(props, rootContainer) {
    _classCallCheck(this, RectElement);

    this.rootContainer = rootContainer;
    var drawTriangle = this.rootContainer.regl({
      frag: '\n      void main() {\n        gl_FragColor = vec4(1, 0, 0, 1);\n      }',

      vert: '\xDF\xDF\n      attribute vec2 position;\n      void main() {\n        gl_Position = vec4(position, 0, 1);\n      }',

      attributes: {
        position: [[0, -1], [-1, 0], [1, 1]]
      },

      count: 3
    });
  }

  _createClass(RectElement, [{
    key: 'finalizeBeforeMount',
    value: function finalizeBeforeMount() {
      return true;
    }

    // Make the draw call

  }, {
    key: 'commitMount',
    value: function commitMount() {}
  }, {
    key: 'getPublicInstance',
    value: function getPublicInstance() {
      return this;
    }
  }, {
    key: 'prepareUpdate',
    value: function prepareUpdate() {
      return ['forceCommit', true];
    }
  }]);

  return RectElement;
}();

exports.default = RectElement;