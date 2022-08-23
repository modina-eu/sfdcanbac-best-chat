/* global Torus jdom css */
/* global Hydra */
/* global hotkeys */
/* global io */

const urlParams = new URLSearchParams(window.location.search);
const debugMode = true;

class State {
  constructor() {
    this.modeKeys = ["form", "infodump", "hashtag"];
    this.modes = {};
    for (const key of this.modeKeys) {
      this.modes[key] = urlParams.get(key) !== null;
    }
    this.dialogMode = "info";
    this.notifications = [
      "Welcome! This is a platform by Naoto for you to explore and discover Naoto's memories and stories."
    ]
    this.notificationsRead = false;
  }
  toggleMode(mode) {
    this.setMode(mode, !this.modes[mode]);
  }
  setMode(mode, value) {
    this.modes[mode] = value;
    this.notifications.push(`${mode} mode ${this.modes[mode] ? "enabled" : "disabled"}`);
    this.notificationsRead = false;
    app.menuApp.render();
  }
  getMode(mode) {
    return this.modes[mode];
  }
}
const state = new State;

class HydraApp extends Torus.StyledComponent {
  init() {
    this.canvas = document.createElement("CANVAS");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.hydra = new Hydra({
      canvas: this.canvas,
      detectAudio: false,
      enableStreamCapture: false
    });
    window.addEventListener('resize',
      () => {
      this.hydra.setResolution(window.innerWidth, window.innerHeight);
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }, true);
  }
  styles() {
    return css`
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background-color: black;
    `
  }
  compose() {
    return jdom`<div>${this.canvas}</div>`;
  }
}

class MenuApp extends Torus.StyledComponent {
  init(app) {
    this.name = window.location.hostname;
    this.app = app;
  }
  styles() {
    return css`
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
    `
  }
  compose() {
    return jdom`
    <div>
      <div class="pointer"
        onclick="${ () => router.go(`/`, {replace: false}) }">
        🏠home
      </div>
      <div class="pointer" onclick="${() => this.app.toggleDialog("inbox")}">
      ${ state.notificationsRead ? "🔔" : "❗" }inbox</div>
    </div>
    `;

    // <div class="pointer" onclick="${() => this.app.toggleDialog("info")}">🔰info</div>
  }
}

class InfoApp extends Torus.StyledComponent {
  init(app) {
    this.app = app;
    this.name = window.location.hostname;
  }
  styles() {
    return css`
      background-color: rgba(255, 255, 255, 0.9);
      color: black;
      padding: 1em;
      box-shadow: 4px 5px 0 rgba(0,0,0,1);
      max-width: 500px;
      .title {
        font-weight: bold;
      }
      a {
        /*font-weight: bold;*/
        color: black;
      }
      div {
        margin: .5em 0 .5em 0;
      }
      .message {
        border: 1px solid black;
      }
    `
  }
  compose() {
    if (state.dialogMode === "info") {
      return jdom`
      <div>
        <div class="title">${ this.name }</div>
        <div>This is a platform by Naoto for you to explore and discover their memories and stories.</div>
        <div><a href="https://naotohieda.com" target="_blank">Naoto Hieda</a> 2022</div>
        <div>Created in the frame of #takecare residency</div>
        <button onclick="${()=>this.app.toggleDialog()}">close</button>
      </div>
      `;
    }
    if (state.dialogMode === "inbox") {
      let messages = [];
      if (state.notifications.length > 0) {
        messages = state.notifications.map(n => {
          if (typeof n === "string") {
            return jdom`<div class="message">${ n }</div>`;
          }
          else {
            return n;
          }
        });
      }
      else {
        messages = [jdom`<div class="message">There is no message.</div>`];
      }
      messages.reverse();
      return jdom`
      <div>
        <div class="title">Inbox</div>
        <div>${ messages }</div>
        <button onclick="${()=>this.app.toggleDialog()}">close</button>
      </div>
      `;
    }
    return jdom`<div>bug</div>`;
  }
}

class SoupElement extends Torus.StyledComponent {
  init(el) {
    this.id = el.id;
    this.name = el.name;
    this.notes = el.notes === undefined ? "" : el.notes;
    this.description = el.description === undefined ? "" : el.description;
    this.insights = el.insights === undefined ? "" : el.insights;
    this.created = el.created;
    this.type = el.type;
    this.image = el.image;
    this.color = el.color;
    this.character = el.character;
    this.alt = el.alt;
    this.related = el.related === undefined ? [] : el.related;
    
    const alt = jdom`
    <div class="alt">
      ${ this.alt }
    </div>
    `;
    let img = "";
    if (this.image !== undefined) {
      img = jdom`
      <div class="images">
        <img alt="${ this.alt }" src="${ this.image }" />
      </div>
      `;
    }
    let color = jdom`
    <div class="alt" style="background-color: ${this.color}">
    </div>
    `;
    this.frame = { img, alt, color };
  }
  styles() {
    return css`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    .content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: stretch;
      border: 1px solid black;
      box-shadow: 4px 5px 0 rgba(0,0,0,1);
    }
    .images > img {
      width: 100%;
      max-width: 500px;
    }
    .alt {
      border: 4px outset black;
      width: 100%;
      padding-bottom: 100%;
    }
    .alt > div {
      position: absolute;
    }
    .info {
      min-width: 200px;
      max-width: 500px;
    }
    .name {
      background-color: white;
      display: inline;
    }
    .notes {
      background-color: white;
    }
    .related {
      background-color: white;
    }

    .relatedElement {
      display: inline;
      color: dodgerblue;
      font-weight: bold;
    }
    `;
  }
  parseRelated() {
    const list = [];
    for (const id of this.related) {
      if (app.loadedElements[id] !== undefined) {
        list.push(jdom`
          <div class="relatedElement pointer"
          onclick="${ () => router.go(`/el/${ id }`, {replace: false}) }">
            #${ app.loadedElements[id].name
                .replace(/(^\w{1})|(\s+\w{1})/g, c => c.toUpperCase())
                .replace(/[ #]/g, "") }
          </div>
        `)
      }
    }
    return list;
  }
  compose() {
    const mode = ["img", "alt", "color"].includes(state.getMode("form")) ? state.getMode("form") : "img";
    
    return jdom`
    <div>
      <div class="content">
        ${ this.frame[mode] }
        <div class="info">
          <div class="name">
            ${ this.name }
          </div>
          <div class="notes">
            ${ this.notes }
            ${ state.getMode("infodump") ? this.insights : "" }
            ${ state.getMode("hashtag") ? this.parseRelated() : "" }
          </div>
        </div>
      </div>
    </div>`;
  }
}

class ContentApp extends Torus.StyledComponent {
  init(app) {
    this.elements = [];
    this.showCount = 20;
  }
  addElement(el) {
    if (el.image !== undefined && el.description !== undefined) {
      const img = jdom`
      <div class="element pointer"
        onclick="${
          () => {
            router.go(`/el/${ el.id }`, {replace: false});
          } }"
      >
        <img lazy alt="${ el.alt }"
          src="${ el.image }" />
      </div>
      `;
      const alt = jdom`
      <div class="alt pointer"
        onclick="${
          () => {
            router.go(`/el/${ el.id }`, {replace: false});
          } }"
      >
        <div>
          ${ el.description != "" ? el.description : el.alt }
        </div>
      </div>
      `;
      const color = jdom`
      <div class="alt pointer" style="background-color: ${ el.color }"
        onclick="${
          () => {
            router.go(`/el/${ el.id }`, {replace: false});
          } }"
      >
      </div>
      `;
      this.elements.push({ img, alt, color });
    }
  }
  styles() {
    return css`
    display: grid;
    place-content: stretch center;
    grid-template-columns: repeat(auto-fill, minmax(300px, max-content));
    @media only screen and (max-width: 600px) {
      grid-template-columns: repeat(auto-fill, minmax(100%, max-content));
    }
    grid-gap: 5px;
    .element {
      position: relative;
      width: 100%;
      padding-top: 100%;
    }
    .element > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 1 / 1;
    }
    .alt {
      border: 4px outset black;
      padding-bottom: 100%;
      position: relative;
    }
    .alt > div {
      position: absolute;
      width: 100%;
    }
    `
  }
  compose() {
    const mode = ["img", "alt", "color"].includes(state.getMode("form")) ? state.getMode("form") : "img";
    return jdom`
    <div class="contents">
      ${ this.elements.slice(-this.showCount).map(e => e[mode]) }
    </div>
    `
  }
}

class App extends Torus.StyledComponent {
  init() {
    this.dialog = false;
    this.hydraApp = new HydraApp();
    this.menuApp = new MenuApp(this);
    this.infoApp = new InfoApp(this);
    this.contentApp = new ContentApp(this);
    
    this.viewElement = { node: "" };
    this.elements = {};
    this.loadedElements = {};
    
    let initId;
    this.bind(router, ([name, params]) => {
      console.log(params);
      switch (name) {
        case "el":
          console.log(params.id);
          this.contentApp.showCount++;
          if (this.elements[params.id] !== undefined) {
            this.viewElement = this.elements[params.id];
            console.log(this.viewElement.name)
            if (this.viewElement.name == "Autism") {
              state.setMode("infodump", true);
            }
            if (this.viewElement.name == "Hashtag") {
              state.setMode("hashtag", true);
            }
            if (this.viewElement.name == "Non Binary") {
              if (state.getMode("form") == "alt") {
                state.setMode("form", null);
              }
              else {
                state.setMode("form", "alt");
              }
            }
            if (this.viewElement.name == "Colors") {
              if (state.getMode("form") == "color") {
                state.setMode("form", null);
              }
              else {
                state.setMode("form", "color");
              }
            }
          }
          else {
            initId = params.id;
          }
          if (this.viewElement.render) {
            this.viewElement.render();
          }
          break;
        default:
          this.viewElement = this.contentApp;
          this.viewElement.render();
          break;
      }
      this.render();
    })

    fetch("/data")
    .then(res => res.json())
    .then(data => {
      data.sort((a, b) => b.hidden - a.hidden);
      console.log(data);
      for (const el of data) {
        if (el.image !== "") {
          this.loadedElements[el.id] = el;
          this.contentApp.addElement(el);
        }
      }
      for (const id of Object.keys(this.loadedElements)) {
        this.elements[id] = new SoupElement(this.loadedElements[id]);
      }
      if (initId !== undefined && this.elements[initId] !== undefined) {
        this.viewElement = this.elements[initId];
      }
      else {
        this.viewElement = this.contentApp;
      }
      this.contentApp.render();
      this.render();
    }).catch(err => {
      console.log(err);
    });
  }
  toggleDialog(mode = "info") {
    state.dialogMode = mode;
    this.dialog = !this.dialog;
    this.infoApp.render();
    this.render();
    if (mode === "inbox") {
      state.notificationsRead = true;
      this.menuApp.render();
    }
  }
  styles() {
    return css`
      // position: absolute;
      width: 100%;
      // height: 100%;
      .container {
        // position: absolute;
        width: 100%;
        // height: 100%;
        // display: flex;
        // flex-direction: column;
        // z-index: 2;
        padding-top: 1.5em;
      }
      .dialog {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .hide {
        display: none;
      }
      .pointer {
        cursor: pointer;
      }
    `;
  }
      // ${ this.hydraApp.node }
  compose() {
    return jdom`
    <div class="wrapper">
      ${ this.menuApp.node }
      <div class="container">
        <div id="dialogback" class="dialog ${ this.dialog ? "" : "hide" }" onclick="${ (e)=>e.target.id=="dialogback"&&this.toggleDialog() }">
          ${ this.infoApp.node }
        </div>
        ${ this.viewElement.node }
      </div>
    </>`;
  }
  loaded() {
    osc().out()
  }
}

const router = new Torus.Router({
  el: "/el/:id",
  default: "/"
});
const app = new App();
document.querySelector("div#app").appendChild(app.node);
router.go(window.location.href.split(window.location.host)[1]);

// logger.log("button", {name: this.name, freeze: false})

// const cameraIndex = urlParams.get("cam") !== null ? urlParams.get("cam") : 0;
// console.log("debug mode: ", debugMode)

// let freeze = 0;
// let freezeDuration = 10 * 1000;

// let emocanvas = document.createElement("canvas")
// emocanvas.width = 30
// emocanvas.height = 30
// let context = emocanvas.getContext("2d")
// context.font = "20px 'sans serif'"
// context.fillText("😵", 0, 20)
// let emourl = emocanvas.toDataURL();

// let startT = new Date;
// class Logger {
//   constructor() {
//     this.socket = io();
//     this.first = true;
//     this.socket.on("connect", () => {
//       console.log("connected");
//       if (this.first === true) {
//         this.loaded(!this.first);
//       }
//       this.first = false;
//     })
//     this.socket.on("reconnect", () => {
//       console.log("reconnected");
//       // this.loaded(true);
//     })
//     this.loaded();
//   }
//   loaded(reconnect = false) {
//     startT = new Date;
//     this.log("loaded", {startT, version: "v2", reconnect, userAgent: navigator.userAgent, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, resolution: [window.innerWidth, window.innerHeight]})
//   }
//   log(tag, data) {
//     if (debugMode === false) {
//       const t = new Date;
//       const time = (t - startT) / 1000;
//       this.socket.emit("log", {tag, data: { time, ...data }});
//     }
//   }
// }

// fetch("/ip")
//   .then(response => response.text())
//   .then(data => { logger.log("ip", {ip: data}) });

// // Put variables in global scope to make them available to the browser console.
// const video = document.createElement('video');
// const constraints = window.constraints = {
//   audio: false,
//   video: { facingMode: "user" },
// };

// const logger = new Logger();
// // const app = new App();
// // document.querySelector("div#app").appendChild(app.node);
// // app.loaded();

// let mouseMoving = false;
// let keyTyping = false;
// setInterval(() => {
//   logger.log("keepalive", { mouseMoving, keyTyping });
//   mouseMoving = false;
//   keyTyping = false;
// }, 1000);
// window.addEventListener("mousemove", e => {
//   mouseMoving = true;
// });
// window.addEventListener("keydown", e => {
//   keyTyping = true;
// });
