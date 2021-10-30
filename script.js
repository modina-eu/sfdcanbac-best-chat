/* global Torus jdom css */
/* global Hydra */
/* global hotkeys */
/* global CodeMirror */

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
    `
  }
  compose() {
    return jdom`<div>${this.canvas}</div>`;
  }
}

class CodeApp extends Torus.StyledComponent {
  init() {
    this.el = document.createElement("TEXTAREA");
    this.console = "";
    this.consoleClass = "";
    this.showEditor = true;

    // https://github.com/ojack/hydra/blob/3dcbf85c22b9f30c45b29ac63066e4bbb00cf225/hydra-server/app/src/editor.js
    this.flashCode = (l0, l1) => {
      if (l0 === undefined) l0 = this.cm.firstLine();
      if (l1 === undefined) l1 = this.cm.lastLine() + 1;
      let count = 0;
      for (let l = l0; l < l1; l++) {
        const start = { line: l, ch: 0 };
        const end = { line: l + 1, ch: 0 };
        setTimeout(() => {
          const marker = this.cm.markText(start, end, {
            css: "background-color: salmon;"
          });
          setTimeout(() => marker.clear(), 300);
        }, (count * 500) / Math.max(1, l1 - l0));
        count++;
      }
    };

    const getLine = () => {
      const c = this.cm.getCursor();
      const s = this.cm.getLine(c.line);
      this.flashCode(c.line, c.line + 1);
      return s;
    };

    this.getCurrentBlock = () => {
      // thanks to graham wakefield + gibber
      const pos = this.cm.getCursor();
      let startline = pos.line;
      let endline = pos.line;
      while (startline > 0 && this.cm.getLine(startline) !== "") {
        startline--;
      }
      while (endline < this.cm.lineCount() && this.cm.getLine(endline) !== "") {
        endline++;
      }
      const pos1 = {
        line: startline,
        ch: 0
      };
      const pos2 = {
        line: endline,
        ch: 0
      };
      const str = this.cm.getRange(pos1, pos2);

      this.flashCode(startline, endline);

      return str;
    };

    this.evalCode = c => {
      try {
        let result = eval(c);
        if (result === undefined) result = "";
        this.console = result;
        this.consoleClass = "normal";
        // localStorage.setItem("hydracode", this.cm.getValue());
      } catch (e) {
        console.log(e);
        this.console = e + "";
        this.consoleClass = "error";
      }
      this.render();
    };

    const commands = {
      evalAll: () => {
        const code = this.cm.getValue();
        this.flashCode();
        this.evalCode(code);
      },
      toggleEditor: () => {
        this.showEditor = !this.showEditor;
        this.render();
      },
      evalLine: () => {
        const code = getLine();
        this.evalCode(code);
      },
      toggleComment: () => {
        this.cm.toggleComment();
      },
      evalBlock: () => {
        const code = this.getCurrentBlock();
        this.evalCode(code);
      }
    };

    const keyMap = {
      evalAll: { key: "ctrl+shift+enter" },
      toggleEditor: { key: "ctrl+shift+h" },
      toggleComment: { key: "ctrl+/" },
      evalLine: { key: "shift+enter,ctrl+enter" },
      evalBlock: { key: "alt+enter" }
    };

    // enable in textarea
    hotkeys.filter = function(event) {
      return true;
    };
    const commandNames = Object.keys(keyMap);
    for (const commandName of commandNames) {
      const hk = keyMap[commandName];
      if (typeof commands[commandName] === "function") {
        hotkeys(hk.key, function(e, hotkeyHandler) {
          e.preventDefault();
          commands[commandName]();
        });
      }
    }
  }
  styles() {
    return css`
      position: relative;
      height: 100%;
      .editor-container {
        position: relative;
        height: 100%;
      }
      .editor-console {
        font-family: monospace;
        font-variant-ligatures: no-common-ligatures;
        font-size: 14pt;
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .error {
        color: crimson;
      }
      .hide {
        visibility: hidden;
      }
    `;
  }
  render() {
    let r = super.render();
    return r;
  }
  loaded() {
    if (this.cm == undefined) {
      this.cm = CodeMirror.fromTextArea(this.el, {
        theme: "paraiso-dark",
        value: "a",
        mode: { name: "javascript", globalVars: true },
        lineWrapping: true,
        styleSelectedText: true
      });
      this.cm.setValue(
        `osc(50,0.1,1.5).rotate(()=>mouse.y/100).modulate(noise(3),()=>mouse.x/window.innerWidth/4).out()`
      );
      this.evalCode(this.cm.getValue());
    }
    this.cm.refresh();
  }
  compose() {
    return jdom`
    <div>
      <div class="editor-container ${this.showEditor ? "" : "hide"}">
        ${this.el}
      </div>
    
      <div class="editor-console">
      >> <code class="${this.consoleClass}">${this.console}</code>
      </div>
    </div>
    `;
  }
}

class InfoApp extends Torus.StyledComponent {
  init() {
    this.name = window.location.hostname;
  }
  styles() {
    return css`
    background-color: rgba(0,0,0,0.5);
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 1em 0 1em;
    margin: 0;
    `
  }
  compose() {
    return jdom`
    <div>
      <div>${this.name}</div>
      <div>info</div>
    </div>
    `;
  }
}

class App extends Torus.StyledComponent {
  init() {
    this.hydraApp = new HydraApp();
    this.codeApp = new CodeApp();
    this.infoApp = new InfoApp();
  }
  styles() {
    return css`
      position: absolute;
      width: 100%;
      height: 100%;
      .container {
        position: absolute;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
    `;
  }
  compose() {
    return jdom`
    <div class="wrapper">
      ${this.hydraApp.node}
      <div class="container">
        ${this.infoApp.node}
        ${this.codeApp.node}
      </div>
    </>`;
  }
  loaded() {
    this.codeApp.loaded();
  }
}

const app = new App();
document.querySelector("div#app").appendChild(app.node);
app.loaded();
