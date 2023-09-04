import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
h2 {
  background-color: lightblue;
}
img {
  width: 400px;
}
img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
}
`;

// export module
export default function(state, emit) {
  const content = state.docs[state.currentDoc];
  return html`
    <div class=${ mainCss } id="md-${ state.currentDoc }">
      ${ content }
    </>
  `;
}
