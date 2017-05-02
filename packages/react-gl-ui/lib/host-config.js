'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSyncScheduling = undefined;
exports.createInstance = createInstance;
exports.appendInitialChild = appendInitialChild;
exports.finalizeInitialChildren = finalizeInitialChildren;
exports.appendChild = appendChild;
exports.insertBefore = insertBefore;
exports.removeChild = removeChild;
exports.shouldSetTextContent = shouldSetTextContent;
exports.resetTextContent = resetTextContent;
exports.createTextInstance = createTextInstance;
exports.commitTextUpdate = commitTextUpdate;
exports.getRootHostContext = getRootHostContext;
exports.getChildHostContext = getChildHostContext;
exports.prepareForCommit = prepareForCommit;
exports.commitMount = commitMount;
exports.prepareUpdate = prepareUpdate;
exports.commitUpdate = commitUpdate;
exports.resetAfterCommit = resetAfterCommit;
exports.scheduleAnimationCallback = scheduleAnimationCallback;
exports.scheduleDeferredCallback = scheduleDeferredCallback;
exports.getPublicInstance = getPublicInstance;
exports.shouldDeprioritizeSubtree = shouldDeprioritizeSubtree;

var _elements = require('./elements');

/* GLUIHostConfig
 *
 * These functions constitute a module, which is the 'piece' of GLUI which
 * integrates with React Fiber. RF calls to these at specific times during
 * the rendering lifecycle when React elements have changed in order to allow
 * the underlying layer (Electron) to be updated accordingly. (Yup, in true
 * React fashion, these are basically just lifecycle methods.)
 *
 * NOTE: It behooves us BIG TIME to play by the rules here, because React Fiber
 * is doing a bunch of deep-magic shit underneath us in order to orchestrate
 * all the things. For the most part, these methods should only be doing "what
 * they're supposed to do". What is that? Well, that's what I've been trying to
 * figure out as I go along.
 *
 * The approach we take here is to represent each 'element' with an instance
 * of a subclass of BaseElement. (The only reason we use inheritance here is
 * to make it easier to implement- and typecheck- new elements.)
 *
 * Most methods are called from the 'inside-out', or starting at the most
 * deeply nested child element and proceeding outward. Conceptually, this makes
 * sense: for instance, if we have...
 *
 * <foo>
 *  <bar />
 * </foo>
 *
 * ...then what will happen, in order, is the following:
 * - Create an instance (B) of "the thing represented by <bar />"
 * - Create an instance (F) of "the thing represented by <foo />"
 * - Do something which semantically links B to F in a child-parent relationship
 *
 * I've done my best to document further below, but much of it is basically
 * just my observations of what these things signify, based on their behavior
 * and what I've been able to glean from digging through ReactDOM and other
 * renderer implementations.
 */

// Create the actual "thing" described by the type and props of the element
// we're looking at. (It will be 'attached' to the thing represented by its
// parent element later on, in appendInitialChild/appendChild/insertBefore.)
function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  var element = (0, _elements.createGLUIInstance)(type, props, rootContainerInstance, hostContext);

  return element;
}

// In this context, the method name means 'append the child elements of
// parentInstance which are present as the parent element is being mounted'
// rather than 'append the first child'. I've renamed it in the hope that it'll
// make a little more sense.
function appendInitialChild(parentInstance, child) {
  parentInstance.appendChildBeforeMount(child);
}

// Likewise, this is meant to finalize an element *after* it has had a chance
// to 'attach' its children (i.e. after `appendInitialChild` has run for all
// its child elements.)
//
// The return value of this function determines whether React Fiber will run
// `commitMount` for the newly created element. (I can't *quite* tell why this
// final, optional pass is necessary. Any hints are welcome.)
function finalizeInitialChildren(newElement, type, props, rootContainerInstance) {
  return newElement.finalizeBeforeMount(type, props, rootContainerInstance);
}

// The difference between this is confusing, but this actually signifies that
// we're appending a child element at some point AFTER parentInstance has been
// mounted (for instance, in response to an update which causes a new child to
// appear in the component tree.)
function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

// As above, but for the case where the new child element is getting stuck
// in between two existing elements.
function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}

// As above, but for the case where the an existing child element is being
// removed.
function removeChild(parentInstance, child) {
  child.finalizeBeforeRemoval();
  parentInstance.removeChild(child);
}

// To be honest, I haven't worked much with this, and if I ever took notes on
// when in the rendering lifecycle it occurs, I've lost them. At any rate, this
// method (and the ones that follow) are related to the case where text gets
// inserted in between elements. For instance, if you had the following JSX
// under react-dom...
//
// `<h1>Hello, <input type="text" />!</h1>`
//
// ...then the `<h1>` would have three children:
// - a TextElement with the value "Hello, "
// - an DOMElement (represented by <input />)
// - a TextElement with the value "!"
//
// As of right now, GLUI doesn't use these. For the sake of keeping things
// tidy and well-accounted-for, however, I *have* created an element type for
// them. (I should probably go make it throw an exception or something.)
function shouldSetTextContent(props) {
  return false;
}

function resetTextContent(element) {
  // noop
}

function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
  throw new Error('TextElements are not supported yet! (do you have some text in your JSX?)');
  // return new TextElement(text, rootContainerInstance);
}

function commitTextUpdate(textElement, oldText, newText) {
  throw new Error('how did you even get a TextElement into the component tree?!');
  // return textElement.commitUpdate(oldText, newText);
}

var DEFAULT_HOST_CONTEXT = {};

// Now, this is an interesting piece of functionality. This basically works
// like context in React components, except it's for _instances_.
//
// Basically, before any element gets instantiated, it has the opportunity
// to create a new HostContext which will be provided to its own children. The
// 'container' (that is, the root under which every element gets mounted).
function getRootHostContext(rootContainerInstance) {
  return DEFAULT_HOST_CONTEXT;
}

function getChildHostContext(parentHostContext, type) {
  return parentHostContext;
}

// Before/after hooks to allow us to manipulate module-specific app state
// ReactDOM uses this to disable its event system before making changes to
// the DOM. I haven't found a particularly important use for it, so it's
// no-opped for now.
function prepareForCommit() {}

// ReactDOM uses this to focus any input elements it just created.
function commitMount(instance, type, newProps, internalInstanceHandle) {
  instance.commitMount(newProps);
}

// In this function, we figure out 'what props changed'. This is sort of like
// 'shouldComponentUpdate' in React proper, but with considerably more detail
// required.
//
// Basically, it's a diff of the props that changed. If nothing changed, we
// return 'null', in which case React Fiber will NOT call commitUpdate. If
// relevant props DID change, then we return an object representing that diff,
// in which case React Fiber WILL call commitUpdate, with that object.
//
// ...or rather, it WILL call commitUpdate, with some object or another, at
// some point in time. You see, this is where Fiber's prioritization scheme
// comes into play. This may actually get called many times, but Fiber will-
// in certain cases- batch updates so that they all happen at once. (I'm still
// unclear as to the precise mechanics here.) At any rate, my understanding is
// that React Fiber is capable of batching multiple "update payloads" together
// into a single call to 'commitUpdate'. I could be wrong.
//
// Only ReactDOM seems to implement this with any significant complexity, so
// I've chosen to implement it in the same fashion, with an array of
// alternating keys/values. (See BaseElement.prepareUpdate for more details.)
//
// From what I can tell, it's completely possible to simply return a non-null
// value from this method, in which case any prop change will eventually result
// in a commitUpdate call.
function prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
  return instance.prepareUpdate(oldProps, newProps, rootContainerInstance);
}

// This function is where updates are actually flushed to the underlying
// abstraction layer- where we actually Do The Thing.
function commitUpdate(instance, updatePayload, // Provided by prepareUpdate
type, oldProps, newProps, internalInstanceHandle) {
  instance.commitUpdate(updatePayload, oldProps, newProps);
}

// The dual of prepareForCommit, this is where ReactDOM turns its event
// handlers and such back on.
function resetAfterCommit() {}

// These functions have something to do with how updates are prioritized and
// scheduled. I have NO idea how the 'timeRemaining' piece works, but I've
// pretty much lifted it wholesale from ReactTestRendererFiber and it seems to
// work OK. For an interesting look at these, take a look at the ReactNoop
// renderer's implementation in the React codebase, and then look at how the
// _tests_ for Fiber code work. Apparently, they got things hooked up so they
// can manually poke the 'clock' along and assert that updates happen at the
// right time.
function scheduleAnimationCallback(fn) {
  setTimeout(fn);
}

// See above. Lifted wholesale from ReactTestRendererFiber.
function scheduleDeferredCallback(fn) {
  setTimeout(fn, 0, { timeRemaining: function timeRemaining() {
      return Infinity;
    } });
}

// This value is called when client code is trying to get a ref to an
// instantiated element. The easiest way to explain: ReactDOM returns the
// actual DOM node object itself. In our case, we allow our 'element instances'
// to decide what the user gets.
//
// This is actually pretty cool. I'm planning to use this to implement 'smart
// refs', which will proxy Electron API calls in a way which corresponds to the
// React element's position in the tree.
function getPublicInstance(instance) {
  return instance.getPublicInstance();
}

// For these last two, I got nothin'. That's why they're at the bottom.
var useSyncScheduling = exports.useSyncScheduling = false;

function shouldDeprioritizeSubtree(type, props) {
  return false;
}