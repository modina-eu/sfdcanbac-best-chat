/* global Torus jdom css */
/* global Hydra */
/* global Airtable */

const urlParams = new URLSearchParams(window.location.search);
const debugMode = true;//urlParams.get("debug") !== null || window.location.pathname !== "/";


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

class AirtableLoader {
  constructor(key, baseName) {
    this.elements = [];
    this.base = new Airtable({ apiKey: key }).base(baseName);
  }
  load(loadCallback, doneCallback) {
    let first = true;

    this.base("Table 1")
    .select({
      pageSize: 100,
      view: "Gallery",
    })
    .eachPage(
      (records, fetchNextPage) => {
        // records.forEach((record) => {
        //   console.log(record.fields);
        // });

        const r = records.map((e) => {
          const el = {};
          el.id = e.id;
          el.name = e.fields.Name;
          // el.created = new Date(e.fields.Created);
          el.notes = e.fields.Notes === undefined ? "" : e.fields.Notes;
          el.image = "";
          el.audio = "";
          if (e.fields.Attachments) {
            for (let i = 0; i < e.fields.Attachments.length; i++) {
              // el.image = e.fields.Attachments[i].url;
              if (e.fields.Attachments[i].thumbnails !== undefined) {
                if (e.fields.Attachments[i].thumbnails.large) {
                  el.image = e.fields.Attachments[i].thumbnails.large.url;
                  break;
                }
              }
              else {
                el.audio = e.fields.Attachments[i].url;
              }
            }
          }
          return el;
        });
        this.elements.push(...r);
        if (loadCallback !== undefined) {
          loadCallback(r);
        }

        // emitter.emit("tablePageLoaded")
        if (first) {
          first = false;
        }
        fetchNextPage();
      },
      (err) => {
        if (doneCallback !== undefined) {
          doneCallback();
        }
        if (err) {
          console.error(err);
          return;
        }
      }
    );
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
        🌐${this.name}
      </div>
      <div class="pointer" onclick="${() => this.app.toggleDialog()}">🔰info</div>
    </div>
    `;
  }
}

class InfoApp extends Torus.StyledComponent {
  init(app) {
    this.app = app;
  }
  styles() {
    return css`
      background-color: rgba(255, 255, 255, 0.9);
      color: black;
      border-radius: 1em;
      padding: 1em;
      box-shadow: 0 0 10px black;
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
    `
  }
  compose() {
    return jdom`
    <div>
      <div class="title">nail.glitches.me</div>
      <div>Naoto Hieda 2022</div>
      <button onclick="${()=>this.app.toggleDialog()}">close</button>
    </div>
    `;
  }
}

class SoupElement extends Torus.StyledComponent {
  init(el) {
    this.id = el.id;
    this.name = el.name === undefined ? "" : el.name;
    this.notes = el.notes === undefined ? "" : el.notes;
    // this.created = el.created;
    this.image = el.image;
    
    this.imageDom = "";
    if (this.image !== undefined) {
      this.imageDom = jdom`
      <div class="images">
        <img src="${ this.image }" />
      </div>
      `;
    }
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
  compose() {
    return jdom`
    <div>
      <div class="content">
        ${ this.imageDom }
        <div class="info">
          <div class="name">
            ${ this.name }
          </div>
          <div class="notes">
            ${ this.notes }
          </div>
        </div>
      </div>
    </div>`;
  }
}

class ContentApp extends Torus.StyledComponent {
  init(app) {
    this.elements = [];
  }
  addElement(el) {
          //     class="pointer"
          // onclick="${
          //   () => {
          //     router.go(`/el/${ el.id }`, {replace: false});
          //     app.render();
          //   } }"
    if (el.image !== undefined && el.image !== "") {
      const d = jdom`
      <div class="element">
        <img lazy
          src="${ el.image }" />
      </div>
      `;
      this.elements.push(d);
    }
    else if (el.audio !== undefined) {
      const d = jdom`
      <div class="element">
        <audio
          controls
          src="${ el.audio }" />
      </div>
      `;
      this.elements.push(d);
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
      background-color: grey;
    }
    .element > img, .element > audio {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 1 / 1;
    }
    `
  }
  compose() {
    return jdom`
    <div class="contents">
      ${ this.elements }
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
          console.log(params.id)
          if (this.elements[params.id] !== undefined) {
            this.viewElement = this.elements[params.id];
          }
          else {
            initId = params.id;
          }
          break;
        default:
          this.viewElement = this.contentApp;
          break;
      }
      this.render();
    })

    this.airtableLoader = new AirtableLoader("key1S3rtGoYU17uqC", "appM4Jz7PKkdKEu0K");
    this.airtableLoader.load(
      // every
      (r) => {
        for (const el of r) {
          if (el.image !== "" || el.audio !== "") {
            this.loadedElements[el.id] = el;
            this.contentApp.addElement(el);
          }
        }
      },
      // done
      () => {
        // for (const id of Object.keys(this.loadedElements)) {
        //   const el = this.loadedElements[id];
        //   if (el.related !== undefined) {
        //     for (const relatedId of el.related) {
        //       if (this.loadedElements[relatedId].related?.some(i => i === id) === false) {
        //         this.loadedElements[relatedId].related.push(id);
        //       }
        //     }
        //   }
        // }
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
      }
    );
  }
  toggleDialog() {
    this.dialog = !this.dialog;
    this.render();
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
