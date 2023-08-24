import html from "choo/html";
import { css } from "@emotion/css";

import menu from "./views/menu.js";
import card from "./views/card.js";
import dialog from "./views/dialog.js";

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
.columns {
  display: flex;
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
  // state.airtableData.map(e => card(state, emit, e))
  let currentCard = "";
  if (state.currentData === undefined) {
    currentCard = "loading";
  }
  else {
    currentCard = card(state, emit, state.currentData);
  }
  
  return html`
    <div class=${ mainCss }>
      ${ menu(state, emit) }
      <div class="container">
        <div id="dialogback" class="dialog ${ state.dialog ? "" : "hide" }" onclick="${ dialogBgClick }">
          ${ dialog(state, emit) }
        </div>
        <div class="columns">
          <div>
            ${ state.content }
          </div>
          <div>
            ${ state.history.length > 0 ? html`
              <span onclick=${ () => backClick() }>
                Back
              </span>`
               : html``
            }
            ${ currentCard }
          </div>
        </div>
      </div>
    </>
  `;
  function dialogBgClick(e) {
    if (e.target.id == "dialogback") {
      emit("hide info");
    }
  }

  function backClick() {
    emit("back");
  }
}
