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
.text {
  font-size: 0.8em;
}
`
const active = true;
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
    <div id=${ item.name } class=${ windowsCss }>
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
    </div>
  `;
  
  function formatLink(id) {
    return html`
    <button>
      ${ state.airtableData[id].name }
    </button>
    `;
  }
}
