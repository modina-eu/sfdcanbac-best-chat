import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
`;

// export module
export default function(state, emit, item) {
  return html`
    <div class=${ mainCss }>
      ${ item.name }
    </div>
  `;
}
