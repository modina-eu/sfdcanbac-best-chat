import raw from "choo/html/raw";
import html from "choo/html";
import twemoji from "@discordapp/twemoji";

import card from "../pages/card.js";

import { html as welcome } from "../docs/welcome.md";
import { html as start } from "../docs/start.md";
import { html as history } from "../docs/history.md";
import { html as airtable } from "../docs/airtable.md";
import { html as photos } from "../docs/photos.md";
import { html as texts } from "../docs/texts.md";
import { html as links } from "../docs/links.md";
import { html as time } from "../docs/time.md";

export default (state, emitter) => {
  const docs = {
    welcome,
    start,
    history,
    airtable,
    photos,
    texts,
    links,
    time,
  }
  const keys = Object.keys(docs);
  
  state.docs = {};
  state.currentDoc = "welcome";
  
  for (const key of keys) {
    const doms = raw(twemoji.parse(docs[key]));
    const divs = [];
    // let first = true;
    for (const dom of doms) {
      // if (first || dom.nodeName == "H2") {
      //   divs.push(html`<div class="md-block"></div>`);
      //   first = false;
      // }
      // divs[divs.length - 1].appendChild(dom);
      if (dom?.textContent.match(/%%/)) {
      console.log(dom)
        divs.push(html`
        <div>a
        ${ card(state, emitter.emit, "24 Hour Card") }
        </div>`);
      }
      else {
        divs.push(dom);
      }
    }
    // console.log(divs)
    state.docs[key] = divs;
    // state.docs[key] = doms;
  }
  
  function parseParams() {
    // console.log(state.params, state.currentDoc)
    // const { key } = state.params;
    // if (key !== undefined && state.docs[key] !== undefined) {
    //   state.currentDoc = key;
    // }
    // emitter.emit("render");
  }

  emitter.on("DOMContentLoaded", parseParams);
  emitter.on("navigate", parseParams);
  emitter.on("popState", parseParams);
}