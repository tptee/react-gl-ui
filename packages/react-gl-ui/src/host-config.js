// @flow
import type HostConfig from 'react-dom/lib/ReactFiberReconciler';

import ReactDOMFrameScheduling from 'react-dom/lib/ReactDOMFrameScheduling';
import { createInstance } from './elements';

// Helpful comments temporarily borrowed from react-ionize:
// https://github.com/mhink/react-ionize/blob/master/src/IonizeHostConfig.js
const hostConfig: HostConfig<*> = {
  getRootHostContext() {
    return {};
  },
  getChildHostContext() {},
  prepareForCommit() {},
  resetAfterCommit() {},
  shouldSetTextContent() {},

  // Create the actual "thing" described by the type and props of the element
  // we're looking at. (It will be 'attached' to the thing represented by its
  // parent element later on, in appendInitialChild/appendChild/insertBefore.)
  //
  // eslint-disable-next-line max-params
  createInstance(type, props, rootContainerInstance, hostContext) {
    return createInstance(type, props, rootContainerInstance, hostContext);
  },

  // In this context, the method name means 'append the child elements of
  // parentInstance which are present as the parent element is being mounted'
  // rather than 'append the first child'. ReactDOM doesn't treat it any
  // differently, and the implementation below matches ReactDOM:
  // https://github.com/facebook/react/blob/master/src/renderers/dom/fiber/ReactDOMFiber.js#L225
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  // Likewise, this is meant to finalize an element *after* it has had a chance
  // to 'attach' its children (i.e. after `appendInitialChild` has run for all
  // its child elements.)
  //
  // The return value of this function determines whether React Fiber will run
  // `commitMount` for the newly created element. (I can't *quite* tell why this
  // final, optional pass is necessary. Any hints are welcome.)
  //
  // eslint-disable-next-line max-params
  finalizeInitialChildren(newElement, type, props, rootContainerInstance) {
    if (typeof newElement.finalizeBeforeMount === 'function') {
      newElement.finalizeBeforeMount(type, props, rootContainerInstance);
    }
  },

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
  // alternating keys/values. (See Element.prepareUpdate for more details.)
  //
  // From what I can tell, it's completely possible to simply return a non-null
  // value from this method, in which case any prop change will eventually result
  // in a commitUpdate call.
  //
  // eslint-disable-next-line max-params
  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance) {
    return instance.prepareUpdate(oldProps, newProps, rootContainerInstance);
  },

  // This function is where updates are actually flushed to the underlying
  // abstraction layer- where we actually Do The Thing.
  //
  // eslint-disable-next-line max-params
  commitUpdate(
    instance,
    updatePayload, // Provided by prepareUpdate
    type,
    oldProps,
    newProps
  ) {
    instance.commitUpdate(updatePayload, oldProps, newProps);
  },

  // ReactDOM uses this to focus any input elements it just created.
  commitMount(instance, type, newProps) {
    instance.commitMount(newProps);
  },

  // Useful to tell Fiber to deprioritize rendering of hidden element trees.
  shouldDeprioritizeSubtree() {
    return false;
  },

  // The difference between this is confusing, but this actually signifies that
  // we're appending a child element at some point AFTER parentInstance has been
  // mounted (for instance, in response to an update which causes a new child to
  // appear in the component tree.)
  appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  // As above, but for the case where the new child element is getting stuck
  // in between two existing elements.
  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild);
  },

  // As above, but for the case where the an existing child element is being
  // removed.
  removeChild(parentInstance, child) {
    if (typeof child.finalizeBeforeMount === 'function') {
      child.finalizeBeforeRemoval();
    }
    parentInstance.removeChild(child);
  },

  scheduleAnimationCallback: ReactDOMFrameScheduling.rAF,
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  useSyncScheduling: false
};

export default hostConfig;
