import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
width: 100%;
`;

// export module
export default function(state, emit) {
  return html`
  <div class=${ mainCss }>
    <div>
      hello world!
    </div>
    <div>
      data: ${ state.data }
    </div>
    <button onclick=${ getData }>
      fetch /api/getdata
    </button>
  </div>`;
  
  function getData() {
    fetch("/api/getdata")
    .then(response => response.json())
    .then(data => {
      state.data = data;
      emit("render");
    })
  }
}
