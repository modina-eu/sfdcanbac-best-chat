import html from "choo/html";
import { css } from "@emotion/css";

import menu from "./views/menu.js";
import card from "./card.js";
import dialog from "./views/dialog.js";

const mainCss = css`
width: 100%;
.container {
  width: 100%;
  padding-top: 1.5em;
  display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	align-content: stretch;
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
  width: 100%;
  max-width: 768px;
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
  console.log(state.cardData)
  
  return html`
  <div>
  <h3>choo New Token</h3>
      <a href="api/redirect-testing">Click to authorize and create a new access token</a>
      <br/>
      ${ state.cardData?.records?.map(e => card(state, emit, e)) }
  </div>`;
  // let content = "loading";
  // if (state.currentData !== undefined) {
  //   content = doc(state, emit);
  // }
  // return html`
  //   <div class=${ mainCss }>
  //     ${ menu(state, emit) }
  //     <div class="container">
  //       <div id="dialogback" class="dialog ${ state.dialog ? "" : "hide" }" onclick="${ dialogBgClick }">
  //         ${ dialog(state, emit) }
  //       </div>
  //       <div class="columns">
  //         ${ content }
  //       </div>
  //     </div>
  //   </>
  // `;
  // function dialogBgClick(e) {
  //   if (e.target.id == "dialogback") {
  //     emit("hide info");
  //   }
  // }
  function oauthRedirect(e) {
    
  }
}
