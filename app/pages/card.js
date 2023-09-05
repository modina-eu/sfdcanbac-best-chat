import html from "choo/html";
import { css } from "@emotion/css";

const paperCss = css`
position: relative;
z-index: 10;
margin: 5px;
padding: 5px;
background-color: ivory;
border-radius: 3px;
box-shadow: 4px 4px 10px black;
overflow: hidden;
width: ${ 300 }px;
height: 400px;
img {
  width: 100%;
  object-fit: cover;
  aspect-ratio: 3 / 2; //todo
}
.links {
  position: absolute;
  bottom: 4px;
}
`
const active = false;
const windowsCss = css`
font-family: "Roboto", arial, sans-serif;
position: relative;
z-index: 10;
margin: 5px;
padding: 5px;
background-color: #bbb;
border: 2px outset #eee;
box-shadow: 4px 4px 0 black;
overflow: hidden;
width: ${ 300 }px;
height: 400px;

.content {
  margin: 0 2px;
}
.title {
  margin: 0 2px;
}
.title::after {
  content: "x";
  
  position: absolute;
  right: 0;
  background-color: #bbb;
  color: ${ active !== true ? "#000" : "#fff" };
  margin: 2px;
  width: 1em;
  font-size: 0.6em;
  text-align: center;
  border: 2px outset #eee;
}
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //cursor: pointer;
  user-select: none;
  background-color: ${ active ? "#00f" : "#888" };
  color: white;
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
  object-fit: cover;
  aspect-ratio: 3 / 2; //todo
}
.links {
  position: absolute;
  bottom: 4px;
}
`;

// export module
export default function(state, emit, cardName) {
  function findItem(name) {
    const keys = Object.keys(state.airtableData);
    const ids = keys.filter(key => state.airtableData[key].name == name);
    if (ids.length > 0) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      return state.airtableData[id];
    }
  }

  console.log(cardName)
  let item;
  if (state.currentData === undefined) {
    return html`<div id="empty"></div>`;
  }
  if (cardName === undefined) {
    const { name } = state.params;
    item = findItem(name);
  }
  else if (typeof cardName === "string") {
    item = findItem(cardName);
  }
  else {
    item = cardName;
  }
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
  
  let currentCss = state.theme == "windows" ? windowsCss : paperCss;

  return html`
    <div id=${ item.name } class=${ currentCss }>
      <div class="header">
        <div class="title">
          ${ item.name }
        </div>
      </div>
      <div class="content">
        ${ img }
        <div>
          ${ item.notes }
        </div>
        <div class="links">
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
