import html from "choo/html";
import { css } from "@emotion/css";

import card from "../card.js";

const mainCss = css`
display: flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content: flex-start;
align-items: center;
align-content: stretch;

h2 {
  text-decoration: underline lightblue 3px;
}
p {
  margin: 0.5em 0;
}
.card {
  margin: 0.5em 0;
}
p:not(.image) {
  width: 100%;
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
//   const rawContent = state.docs[state.currentDoc];
//   const content = [];
  
//   for (const dom of rawContent) {
//     if (dom?.textContent.match(/%%/)) {
//       let cardName = dom?.textContent.replace(/%%(.*)%%/, "$1");
//       content.push(html`<div class="card">${ card(state, emit, cardName) }</div>`);
//     }
//     else {
//       content.push(dom);
//     }
//   }

  return html`
    <div class=${ mainCss } id="md-${ state.currentDoc }">
      ${ state.docs[state.currentDoc] }
    </>
  `;
}
