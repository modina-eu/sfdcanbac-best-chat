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
  const content = state.docs[state.currentDoc];
  return html`
    <div class=${ mainCss } id="md-${ state.currentDoc }">
      ${ content }
    </>
  `;
}
