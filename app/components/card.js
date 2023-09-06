import html from "choo/html";
import Component from "choo/component";

import { css } from "@emotion/css";

const mainCss = css`
`;
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
.text {
  font-size: 0.8em;
}
`
const active = false;
const windowsCss = css`
width: ${ 300 }px;
height: 400px;
position: relative;
.frontside {
  width: 100%;
  height: 100%;
  // backface-visibility: hidden;
  transform: rotate3d(0, 1, 0, 180deg);

  font-family: "Roboto", arial, sans-serif;
  position: relative;
  z-index: 10;
  margin: 5px;
  padding: 5px;
  background-color: #bbb;
  border: 2px outset #eee;
  // box-shadow: 8px 4px 0 black;
  overflow: hidden;
}
.frontside.trigger {
  animation: turnIn 1s;
  animation-fill-mode: forwards;
  @keyframes turnIn {
    0% {
      transform: rotate3d(0, 1, 0, 180deg);
    }
    100% {
      transform: rotate3d(0, 1, 0, 0deg);
    }
  }
}
.frontside.triggerback {
  animation: turnOut 0.5s;
  animation-fill-mode: forwards;
  @keyframes turnOut {
    0% {
      transform: rotate3d(0, 1, 0, 0deg);
    }
    100% {
      transform: rotate3d(0, 1, 0, 180deg);
    }
  }
}
.backside {
  width: 100%;
  height: 100%;
  // backface-visibility: hidden;
  transform: translate3d(0,0,1px) rotate3d(0, 1, 0, 0deg);
  position: absolute;
  top: 0;
  left: 0;
  // box-shadow: 8px 4px 0 black;
}
.backside.trigger {
  animation: turnIn2 1s;
  animation-fill-mode: forwards;
  @keyframes turnIn2 {
    0% {
      transform: rotate3d(0, 1, 0, 0deg);
    }
    100% {
      transform: rotate3d(0, 1, 0, 180deg);
    }
  }
}
.backside.triggerback {
  animation: turnOut2 0.5s;
  animation-fill-mode: forwards;
  @keyframes turnOut2 {
    0% {
      transform: rotate3d(0, 1, 0, 180deg);
    }
    100% {
      transform: rotate3d(0, 1, 0, 0deg);
    }
  }
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
    this.id = id;
    this.local = state.components[id] = {};
    this.state = state;
    this.emit = emit;
    this.loaded = false;
  }
  
  turnUp() {
    this.element.querySelector(".frontside").classList.add("trigger");
    this.element.querySelector(".backside").classList.add("trigger");
  }

  turnDown() {
    this.element.querySelector(".frontside").classList.add("triggerback");
    this.element.querySelector(".backside").classList.add("triggerback");
  }

  load(element) {
    console.log(this.element, this.id)
    var observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting === true) {
        console.log("oi")
        this.turnUp();
      }
    }, { threshold: [0.5] });

    observer.observe(this.element);
  }

  update({ name = "24 Hour Deck" } = {}) {
    // if (this.loaded && name == this.name) {
    //   return false;
    // }
    
    this.turnDown();
    setTimeout(() => {
      while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
      }

      this.element.appendChild(this.renderCard({ name, trigger: true }));
    }, 500);
    return false;
  }

  createElement({ name = "24 Hour Deck", trigger = false } = {}) {
    return this.renderCard({ name, trigger });
  }
  renderCard({ name, trigger } = {}) {
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
    console.log(cardName)
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
    
    this.loaded = true;
    
    const formatLink = (name) => {
      return html`
      <button onclick=${ () => {
        this.update({ name });
        // this.emit("render")
      } }>
        ${ name }
      </button>
      `;
    }

    const links = [];
    if (item.links !== undefined) {
      for (const name of item.links) {
        links.push(formatLink(state.airtableData[name].name));
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
      <div class=${ currentCss }>
        <div class="frontside ${ trigger ? "trigger" : "" }">
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
        <img class="backside ${ trigger ? "trigger" : "" }" src="https://cdn.glitch.global/61984d65-52b6-418b-b420-2547b4acca3d/back.png?v=1693928196097"/>
      </div>
    `;
  }
}
