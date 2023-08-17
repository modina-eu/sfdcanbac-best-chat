import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
`;

// export module
export default function(state, emit) {
  return html`
    <div class=${ mainCss }>
      hallo ${ state.msg }
    </div>
  `;
}
