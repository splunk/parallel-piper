import vdom from "vdom";

import createElement from "virtual-dom/create-element";
import vdiff from "virtual-dom/diff";
import vpatch from "virtual-dom/patch";

class Page {
  constructor(renderFn) {
    this.renderFn = renderFn;
    this.tree = null;
    this.el = null;
  }

  update(state) {
    var tree = this.renderFn(state);
    var patch = vdiff(this.tree, tree);
    vpatch(this.el, patch);
    this.tree = tree;
  }

  render(parentNode, state) {
    var tree = (this.tree = this.renderFn(state));
    var el = (this.el = createElement(tree));
    parentNode.appendChild(el);
  }
}

export default Page;
