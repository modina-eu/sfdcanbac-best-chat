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
a {
  color: white;
  text-decoration: none;
}
`;

// export module
export default function(state, emit) {
  const name = "Heartbreak Cards";
  return html`
    <div class=${ mainCss }>
      <div class="">
        <a href="/">🌐${ name }</a>
      </div>
    </div>
  `;
  function toggleTheme(e) {
    const theme = state.theme == "windows" ? "paper" : "windows";
    emit("set theme", { theme });
  }
  function showInfo(e) {
    emit("show info");
  }
}
