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
.no-print {
  @media print {
    display: none;
  }
}
`;

// export module
export default function(state, emit) {
  console.log(state.cardData)
  
  return html`
  <div class=${ mainCss }>
    <div class="no-print">
      <h3>New Token</h3>
      <a href="api/redirect-testing">Click to authorize and create a new access token</a>
    </div>
    ${ state.cardData?.records?.map(e => card(state, emit, e)) }
  </div>`;
  function oauthRedirect(e) {
    
  }
}
