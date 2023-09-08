import raw from "choo/html/raw";
import html from "choo/html";
import twemoji from "@discordapp/twemoji";

import { html as welcome } from "../docs/welcome.md";
import { html as start } from "../docs/start.md";
import { html as naoto } from "../docs/naoto.md";
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
    naoto,
    history,
    airtable,
    photos,
    texts,
    links,
    time,
  }
  const keys = Object.keys(docs);
  
  state.docs = {};
  
  for (const key of keys) {
    const doms = raw(twemoji.parse(docs[key]));
    const divs = [];
    // let first = true;
    state.docs[key] = doms.map(d => {
      if (d.childNodes[0]?.nodeName == "IMG") {
        d.classList.add("image");
      }
      return d;
    });
  }
  
  function findPage() {
    const { key } = state.params;
    if (key !== undefined && state.docs[key] !== undefined) {
      state.currentDoc = key;
    }
    else {
      state.currentDoc = "welcome";
    }
  }
  
  emitter.on("navigate", () => {
    findPage();
  });
  findPage();
}