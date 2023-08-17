import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
position: fixed;
z-index: 3;
width: 100%;
background-color: rgba(0,0,0,0.5);
color: white;
display: flex;
justify-content: space-between;
padding: 0 .1em 0 .1em;
margin: 0;
flex: 1 1 auto;

.inline {
  display: inline;
}
.pointer {
  cursor: pointer;
}
`;

// export module
export default function(state, emit) {
  const name = "Me Cards";
  return html`
    <div class=${ mainCss }>
      <div class="">
        🌐${ name }
      </div>
      <div class="pointer" onclick="${onclick}">🔰info</div>
    </div>
  `;
  function onclick(e) {
    
  }
}
