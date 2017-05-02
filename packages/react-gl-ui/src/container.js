// @flow

export default class Container<Element> {
  children: Array<Element>;
  regl: Function;

  constructor(regl: Function) {
    this.regl = regl;
    this.children = [];
  }

  appendChild(child: Element) {
    this.children.push(child);
  }

  insertBefore(child: Element, beforeChild: Element) {
    this.children.splice(this.children.indexOf(beforeChild), 0, child);
  }

  removeChild(child: Element) {
    this.children.splice(this.children.indexOf(child));
  }
}
