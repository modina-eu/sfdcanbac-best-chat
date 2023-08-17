import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
background-color: rgba(255, 255, 255, 0.9);
color: black;
border-radius: 1em;
padding: 1em;
max-width: 500px;
.title {
  font-weight: bold;
}
a {
  /*font-weight: bold;*/
  color: black;
}
div {
  margin: .5em 0 .5em 0;
}
`;

// export module
export default function(state, emit) {
  return html`
    <div class=${ mainCss }>
      <div class="title">Me Cards</div>
      <div>Naoto Hieda 2023</div>
      <button onclick="${()=>emit("hide info")}">close</button>
    </div>
  `;
}
