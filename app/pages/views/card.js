import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
z-index: 10;
margin: 5px;
padding: 5px;
background-color: #bbb;
border: 2px outset #eee;
box-shadow: 4px 4px 0 black;
overflow: hidden;
max-width: ${ 500 }px;

.content {
  margin: 0 2px;
}
.title {
  margin: 0 2px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  background-color: ${ true ? "#00f" : "#888" };
  color: white;
}
.button {
  background-color: #bbb;
  color: ${ true !== true ? "#000" : "#fff" };
  margin: 2px;
  width: 1em;
  text-align: center;
  border: 2px outset #eee;
}
.pressed {
  border: 2px inset #eee;
}
button {
  border: 2px outset #eee;
  margin: auto 1px;
  display: inline;
  font-size: 1em;
}
img {
  width: 100%;
}
`;

// export module
export default function(state, emit, item) {
  const links = [];
  if (item.links !== undefined) {
    for (const id of item.links) {
      links.push(formatLink(id));
    }
  }
  
  let img = "";
  if (item.image != "") {
    img = html`
    <div>
      <img src=${ item.image } />
    </div>`;
  }

  return html`
    <div class=${ mainCss }>
      <div class="header">
        <div class="title">
          ${ item.name }
        </div>
        <div class="button">x</div>
      </div>
      <div class="content">
        ${ img }
        <div>
          ${ item.notes }
        </div>
        <div>
          ${ links }
        </div>
      </div>
    </div>
  `;
  
  function formatLink(id) {
    return html`
    <button onclick=${ () => linkClick(id) }>
      ${ state.airtableData[id].name }
    </button>
    `;
  }
  
  function linkClick(id) {
    emit("jump", id);
  }

}
