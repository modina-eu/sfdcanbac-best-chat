import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
h2 {
  background-color: lightblue;
}
img {
  width: 400px;
  max-width: 100%;
}
img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
}
a {
  color: black;
  font-weight: bold;
}
a:hover {
  color: white;
  background-color: black;
}
blockquote {
  margin: 0;
  padding-left: 10px;
  border-left: solid 5px lightgrey;
  // font-style: italic;
}
`;

// export module
export default function(state, emit) {
  const rawContent = state.docs[state.currentDoc];
  const content = [];
    for (const dom of rawContent) {
    // if (first || dom.nodeName == "H2") {
    //   divs.push(html`<div class="md-block"></div>`);
    //   first = false;
    // }
    // divs[divs.length - 1].appendChild(dom);
    if (dom?.textContent.match(/%%/)) {
      let cardName = dom?.textContent.replace(/%%(.*)%%/, "$1");
      divs.push(html`
      <div>a
      ${ card(state, emitter.emit, cardName) }
      </div>`);
    }
    else {
      divs.push(dom);
    }
  }
  // console.log(divs)
  state.docs[key] = divs;

  return html`
    <div class=${ mainCss } id="md-${ state.currentDoc }">
      ${ content }
    </>
  `;
}
