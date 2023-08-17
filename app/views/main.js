import html from "choo/html";
import { css } from "@emotion/css";
import menu from "./menu.js";
import card from "./card.js";

const mainCss = css`
width: 100%;
.container {
  width: 100%;
  padding-top: 1.5em;
}
.dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
}
.hide {
  display: none;
}
.pointer {
  cursor: pointer;
}
`;

// export module
export default function(state, emit) {
  return html`
    <div class=${ mainCss }>
      ${ menu(state, emit) }
      <div class="container">
        <div id="dialogback" class="dialog ${ state.dialog ? "" : "hide" }" onclick="${ (e)=>e.target.id=="dialogback"&&this.toggleDialog() }">
          ${ "info" }
        </div>
        ${ state.airtableData.map(e => card(state, emit, e)) }
      </div>
    </>
  `;
}
