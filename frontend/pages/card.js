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
//width: ${ 300 }px;
//height: 400px;
position: relative;

font-size: 2em;
  box-sizing: border-box;
  position: relative;
  margin: 0;
  padding: 0;
  // height: 29.7cm;
  // width: 21cm;
  height: ${9.40*2}cm;
  width: ${6.9*2}cm;
  break-after: always;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;
  border: 0.5cm outset #eee;
  background-color: #bbb;

.frontside {
  width: 100%;
  height: 100%;

  font-family: "Roboto", arial, sans-serif;
  position: relative;
  z-index: 10;
  margin: 5px;
  padding: 5px;
  background-color: #bbb;
  // border: 2px outset #eee;
  overflow: hidden;
}
.content {
  margin: 0 2px;
}
.title {
  margin: 0 2px;
  min-height: 1em;
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

const mainCss = css`
page {
  width: 100%;
  height: 100%;
}
`;

// export module
export default function(state, emit, item) {
  const links = [];
  if (item.fields["Table 1"] !== undefined) {
    for (const id of item.fields["Table 1"]) {
      links.push(formatLink(id));
    }
  }
  
  let img = "";
  if (item.fields?.Attachments?.at(0)?.thumbnails?.large?.url) {
    img = html`
    <div>
      <img src=${ item.fields?.Attachments?.at(0)?.thumbnails?.large?.url } />
    </div>`;
  }
  else {
    img = html`
    <div>
      <img src=${ item.fields?.Attachments?.at(0)?.thumbnails?.large?.url } />
    </div>`;
  }
  
  return html`
    <div id=${ item.id } class="${ mainCss } ${ windowsCss }">
      <page>
        <div class="frontside">
          <div class="header">
            <div class="title">
              ${ item.fields?.Name }
            </div>
          </div>
          <div class="content">
            ${ img }
            <div class="text">
              ${ item.fields?.Notes }
            </div>
            <div class="links">
              ${ links }
            </div>
          </div>
        </div>
      </page>
    </div>
  `;
  
  function formatLink(id) {
    return html`
    <button>
      ${ state.cardData.records.find(e => e.id == id).fields.Name }
    </button>
    `;
  }
}
