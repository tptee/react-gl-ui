'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = require('./elements');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLUIContainer = function () {
  function GLUIContainer(regl) {
    _classCallCheck(this, GLUIContainer);

    this.regl = regl;
    this.children = [];
  }

  _createClass(GLUIContainer, [{
    key: 'appendChild',
    value: function appendChild(child) {
      this.children.push(child);
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore(child, beforeChild) {
      this.children.splice(this.children.indexOf(beforeChild), 0, child);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      this.children.splice(this.children.indexOf(child));
    }
  }]);

  return GLUIContainer;
}();

exports.default = GLUIContainer;