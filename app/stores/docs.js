import raw from "choo/html/raw";
import html from "choo/html";

import { html as welcome } from "../docs/welcome.md";
import { html as start } from "../docs/start.md";
import { html as airtable } from "../docs/airtable.md";

export default (state, emitter) => {
  const docs = {
    welcome,
    start,
    airtable,
  }
  const keys = Object.keys(docs);
  
  state.docs = {};
  state.currentDoc = "welcome";
  
  for (const key of keys) {
    const doms = raw(docs[key]);
    const divs = [];
    let first = true;
    for (const dom of doms) {
      if (first || dom.nodeName == "H2") {
        divs.push(html`<div class="md-block"></div>`);
        first = false;
      }
      divs[divs.length - 1].appendChild(dom);
    }
    console.log(divs)
    state.docs[key] = divs;
  }
  
  function parseParams() {
    console.log(state.params, state.currentDoc)
    const { key } = state.params;
    if (key !== undefined && state.docs[key] !== undefined) {
      state.currentDoc = key;
    }
    emitter.emit("render");
  }

  emitter.on("DOMContentLoaded", parseParams);
  emitter.on("navigate", parseParams);
  emitter.on("popState", parseParams);
}