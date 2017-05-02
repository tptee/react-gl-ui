'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureWrappedEventHandler;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureWrappedEventHandler(emitter, attachedHandlers, propKey, eventKey, rawHandler, wrapper) {
  var rawEventKey = eventKey + '_raw';
  var removingHandler = rawHandler === undefined && attachedHandlers[rawEventKey] !== undefined;

  var changingHandler = rawHandler !== undefined && attachedHandlers[rawEventKey] !== undefined && rawHandler !== attachedHandlers[rawEventKey];

  var newHandler = rawHandler !== undefined && attachedHandlers[rawEventKey] === undefined;

  if (removingHandler || changingHandler) {
    var existingHandler = attachedHandlers[eventKey];
    emitter.removeListener(eventKey, existingHandler);
    delete attachedHandlers[eventKey];
    delete attachedHandlers[rawEventKey];
  }

  if (changingHandler || newHandler) {
    var handler = function handler() {
      return wrapper(rawHandler);
    };
    attachedHandlers[eventKey] = handler;
    attachedHandlers[rawEventKey] = rawHandler;
    emitter.on(eventKey, handler);
  }
}