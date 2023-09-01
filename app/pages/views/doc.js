import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
h2 {
  background-color: lightblue;
}
`;

// export module
export default function(state, emit) {
  const content = state.docs[state.currentDoc];
  return html`
    <div class=${ mainCss }>
      ${ content }
    </>
  `;
}
