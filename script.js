/* global Torus jdom css */
/* global Hydra */
/* global hotkeys */
/* global Airtable */
/* global markdownit */

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
    this.md = new markdownit({linkify: true, breaks: true});
    this.elements = [];
    this.base = new Airtable({ apiKey: key }).base(baseName);
  }
  load(loadCallback) {
    let first = true;

    this.base("Table 1")
    .select({
      pageSize: 6,
      view: "Gallery",
    })
    .eachPage(
      (records, fetchNextPage) => {
        // records.forEach((record) => {
        //   console.log(record.fields);
        // });

        const r = records.map((e) => {
          const el = {};
          el.name = e.fields.Name;
          el.created = new Date(e.fields.Created);
          el.notes = e.fields.Notes === undefined ? "" : e.fields.Notes;
          el.notes = this.md.render(el.notes)
          // .replace(/(<a )/g, `$1 target="_blank" `);
          el.type = e.fields.Type;
          el.image = "";
          if (e.fields.Attachments) {
            for (let i = 0; i < e.fields.Attachments.length; i++) {
              el.image = e.fields.Attachments[i].url;
              if (e.fields.Attachments[i].thumbnails !== undefined) {
                if (e.fields.Attachments[i].thumbnails.large) {
                  el.image = e.fields.Attachments[i].thumbnails.large.url;
                  break;
                }
              }
            }
          }
          el.related = e.fields.Related;
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
      function done(err) {
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
      <div class="url">🌐${this.name}</div>
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
      <div class="title">hydra-editor-torus</div>
      <div>This project is a small <a href="https://github.com/ojack/hydra-synth/" target="_blank">Hydra</a> editor made with <a href="https://github.com/thesephist/torus" target="_blank">Torus</a> JavaScript framework. Feel free to <a href="https://glitch.com/edit/#!/hydra-editor-torus" target="_blank">remix</a> the project to make your own editor!</div>
      <div>Naoto Hieda 2021</div>
      <button onclick="${()=>this.app.toggleDialog()}">close</button>
    </div>
    `;
  }
}

class SoupElement extends Torus.StyledComponent {
  init(el) {
    this.name = el.name;
    this.notes = el.notes === undefined ? "" : el.notes;
  }
  styles() {
    return css`
    position: relative;
    .name {
      background-color: white;
      display: inline;
    }
    .notes {
      background-color: white;
    }
    `;
  }
  compose() {
    return jdom`
    <div>
      <div class="name">
        ${ this.name }
      </div>
      <div class="notes">
        ${ this.notes }
      </div>
    </div>`;
  }
}

class App extends Torus.StyledComponent {
  init() {
    this.dialog = false;
    this.hydraApp = new HydraApp();
    this.menuApp = new MenuApp(this);
    this.infoApp = new InfoApp(this);
    
    this.elements = [];
    
    this.airtableLoader = new AirtableLoader("keyTYazyYV8X1bjqR", "app1d5uZIdpFJ67RW");
    this.airtableLoader.load((r) => {
      for (const el of r) {
        this.elements.push(new SoupElement(el));
      }
      this.render();
    });
  }
  toggleDialog() {
    this.dialog = !this.dialog;
    this.render();
  }
  styles() {
    return css`
      position: absolute;
      width: 100%;
      height: 100%;
      .container {
        position: absolute;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 2;
      }
      .dialog {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3;
        background-color: rgba(0, 0, 0, 0.3);
      }
      .hide {
        display: none;
      }
    `;
  }
  compose() {
    return jdom`
    <div class="wrapper">
      ${ this.hydraApp.node }
      <div class="container">
        ${ this.menuApp.node }
        ${ this.elements.map(e => e.node) }
      </div>
      <div id="dialogback" class="dialog ${ this.dialog ? "" : "hide" }" onclick="${ (e)=>e.target.id=="dialogback"&&this.toggleDialog() }">
        ${ this.infoApp.node }
      </div>
    </>`;
  }
  loaded() {
    osc().out()
  }
}

const app = new App();
document.querySelector("div#app").appendChild(app.node);
app.loaded();

