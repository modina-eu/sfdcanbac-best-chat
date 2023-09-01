import raw from "choo/html/raw";
import html from "choo/html";

import { html as welcome } from "../docs/welcome.md";
import { html as start } from "../docs/start.md";

export default (state, emitter) => {
  const docs = {
    welcome,
    start,
  }
  const keys = Object.keys(docs);
  
  state.content = {};
  
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
    state.content[key] = divs;
  }
}