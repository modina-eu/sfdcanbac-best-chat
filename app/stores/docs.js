import raw from "choo/html/raw";
import html from "choo/html";

const imageUrl = new URL(`../docs/${"welcome"}.md`, import.meta.url).href
// import { html as htmlContent } from "../docs/content.md";

export default (state, emitter) => {
console.log(imageUrl)
  // const doms = raw(htmlContent);
  // const divs = [];
  // let first = true;
  // for (const dom of doms) {
  //   if (first || dom.nodeName == "H2") {
  //     divs.push(html`<div class="md-block"></div>`);
  //     first = false;
  //   }
  //   divs[divs.length - 1].appendChild(dom);
  // }
  // console.log(divs)
  // state.content = divs;
}