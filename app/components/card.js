import html from "choo/html";
import Component from "choo/component";

import { css } from "@emotion/css";

const mainCss = css`
`;
const active = false;
const windowsCss = css`
width: ${ 300 }px;
height: 400px;
position: relative;
.frontside {
  width: 100%;
  height: 100%;
  animation: turnIn 1s;
  backface-visibility: hidden;
  @keyframes turnIn {
    0% {
      // opacity: 0;
      transform: rotate3d(0, 1, 0, 180deg);
    }
    100% {
      // opacity: 1;
      transform: rotate3d(0, 1, 0, 0deg);
    }
  }

  font-family: "Roboto", arial, sans-serif;
  position: relative;
  z-index: 10;
  margin: 5px;
  padding: 5px;
  background-color: #bbb;
  border: 2px outset #eee;
  box-shadow: 8px 4px 0 black;
  overflow: hidden;
}
.backside {
  width: 100%;
  height: 100%;
  animation: turnIn2 1s;
  backface-visibility: hidden;
  @keyframes turnIn2 {
    0% {
      // opacity: 0;
      transform: rotate3d(0, 1, 0, 0deg);
    }
    100% {
      // opacity: 1;
      transform: rotate3d(0, 1, 0, 180deg);
    }
  }
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate3d(0, 1, 0, 180deg);
  box-shadow: 8px 4px 0 black;
}
.backside.loading {
  animation: none;
}
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
  color: ${ active ? "#000" : "#fff" };
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
  font-size: 0.9em;
  font-family: "Roboto", arial, sans-serif;
  color: black;
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
.text {
  font-size: 0.8em;
}
`;

export default class extends Component {
  constructor(id, state, emit) {
    super(id)
    this.local = state.components[id] = {};
    this.state = state;
    this.emit = emit;
    this.loaded = false;
  }

  load(element) {
    console.log(element)
  }

  update({ name = "24 Hour Deck" } = {}) {
    if (this.loaded) {
      return false;
    }
    return true
  }

  createElement({ name = "24 Hour Deck" } = {}) {
    let cardName = name;
    const state = this.state;
    function findItem(name) {
      const keys = Object.keys(state.airtableData);
      const ids = keys.filter(key => state.airtableData[key].name == name);
      if (ids.length > 0) {
        const id = ids[Math.floor(Math.random() * ids.length)];
        return state.airtableData[id];
      }
    }

    let currentCss = windowsCss//state.theme == "windows" ? windowsCss : paperCss;

    let item;
    if (state.currentData === undefined) {
      return html`
      <div class=${ currentCss }>
        <img class="backside loading" src="https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/back.png?v=1693928196097"/>
      </div>
      `;
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
    
    const formatLink = (id) => {
      return html`
      <button onclick=${ () => linkClick(id) }>
        ${ state.airtableData[id].name }
      </button>
      `;
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

    return html`
      <div id=${ item.name } class=${ currentCss }>
        <div class="frontside">
          <div class="header">
            <div class="title">
              ${ item.name }
            </div>
          </div>
          <div class="content">
            ${ img }
            <div class="text">
              ${ item.notes }
            </div>
            <div class="links">
              ${ links }
            </div>
          </div>
        </div>
        <img class="backside" src="https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/back.png?v=1693928196097"/>
      </div>
    `;
  }
}
