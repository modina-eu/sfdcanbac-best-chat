import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
width: 100%;
padding: 10px;
font-size: 1em;
h1 {
  background-color: yellow;
}
.code {
  font-family: Menlo, Consolas, Monaco, "Lucida Console", monospace;
}
.footer {
  display: flex;
  justify-content: space-between;
  margin: 2rem auto 0;
  padding: 1rem 0 0.75rem 0;
  flex-wrap: wrap;
  border-top: 4px solid #fff;
}
.footer a:hover,
.footer a:focus {
  background: #fff;
}
.footer .tagline {
  padding: 0.25rem 1rem 1rem;
  font-size: clamp(1rem, 0.925rem + 0.3333vw, 1.1rem);
  text-align: left;
  white-space: nowrap;
  flex-grow: 8;
}
.btn--remix {
  font-family: Menlo, Consolas, Monaco, "Lucida Console", monospace;
  padding: 0.8rem 1.75rem;
  line-height: 1rem;
  font-weight: 500;
  height: 3rem;
  align-items: center;
  cursor: pointer;
  background: #ffffff;
  border: 2px solid #000000;
  box-sizing: border-box;
  border-radius: 4px;
  text-decoration: none;
  color: #000000;
  white-space: nowrap;
  margin: 6px 1rem 1.5rem 1rem;
  flex-grow: 1;
}
.btn--remix img {
  position: relative;
  top: 1px;
  margin-right: 0.25rem;
}
.btn--remix:hover,
.btn--remix:focus {
  background-color: #d0fff1;
}
`;

// export module
export default function(state, emit) {
  return html`
  <div class=${ mainCss }>
    <h1>
      hello world from choo!
    </h1>
    <div>
      data: <span class="code">${ JSON.stringify(state.data) }</span>
    </div>
    <button onclick=${ getData }>
      fetch /api/getrandomhello
    </button>
    <div class="footer">
      <a
        class="btn--remix"
        target="_top"
        href="https://glitch.com/edit/#!/remix/vite-node-template"
      >
        <img
          src="https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FLogo_Color.svg?v=1618199565140"
          alt=""
        />
        Remix!
      </a>
    </div>
  </div>`;
  
  function getData() {
    fetch("/api/getrandomhello")
    .then(response => response.json())
    .then(data => {
      state.data = data;
      emit("render");
    })
  }
}
