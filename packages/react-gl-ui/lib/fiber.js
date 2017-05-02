'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLUIFiber = exports.GLUIRenderer = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');

var _ReactFiberReconciler2 = _interopRequireDefault(_ReactFiberReconciler);

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _hostConfig = require('./host-config');

var GLUIHostConfig = _interopRequireWildcard(_hostConfig);

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GLUIRenderer = exports.GLUIRenderer = new _ReactFiberReconciler2.default(GLUIHostConfig);

var GLUIFiber = exports.GLUIFiber = {
  container: null,
  root: null,
  regl: null,

  render: function render(element, canvas) {
    this.regl = (0, _regl2.default)({ canvas: canvas });
    this.container = new _container2.default(this.regl);
    this.root = GLUIRenderer.createContainer(this.container);
    return this.update(element, canvas);
  },
  update: function update(element, callback) {
    if (!this.root) {
      this.render(element, callback);
    }
  },
  chain: function chain(el, cbOrEl) {
    for (var _len = arguments.length, restPairs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      restPairs[_key - 2] = arguments[_key];
    }

    var _this = this;

    if (el) {
      this.update(el, function () {
        if (typeof cbOrEl === 'function') {
          cbOrEl();
          _this.chain.apply(_this, restPairs);
        } else if ((typeof cbOrEl === 'undefined' ? 'undefined' : _typeof(cbOrEl)) === 'object') {
          _this.chain.apply(_this, [cbOrEl].concat(restPairs));
        }
      });
    }
  },
  reset: function reset() {
    delete this.regl;
    delete this.container;
    delete this.root;
  }
};