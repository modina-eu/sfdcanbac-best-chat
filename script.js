/* global Torus jdom css */

// <div id="canvas-container">
// </div>

// <div id="editors">
// <div id="editor-container" class="container">

// </div>
// </div>

class App extends Torus.StyledComponent {
  initHydra() {
    this.canvas = document.createElement("CANVAS");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.hydra = new Hydra({
      canvas: this.canvas,
      detectAudio: false,
      enableStreamCapture: false
    });
    osc().out()
  }
  init() {
    this.initHydra();
  }
  style() {
    return css`
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}`
  }
  compose() {
    return jdom`${this.canvas}`
  }
}

const app = new App();
document.querySelector("div#app").appendChild(app.node);


var container = document.querySelector("#editor-container");
var el = document.createElement("TEXTAREA");
//document.body.appendChild(container);
container.appendChild(el);

// const cm = CodeMirror.fromTextArea(el, {
//   theme: "paraiso-dark",
//   value: "a",
//   mode: { name: "javascript", globalVars: true },
//   lineWrapping: true,
//   styleSelectedText: true
// });
// cm.refresh();
// cm.setValue(`osc(50,0.1,1.5).rotate(()=>mouse.y/100).modulate(noise(3),()=>mouse.x/window.innerWidth/4).out()`);

// // https://github.com/ojack/hydra/blob/3dcbf85c22b9f30c45b29ac63066e4bbb00cf225/hydra-server/app/src/editor.js
// const flashCode = function(start, end) {
//   if (!start) start = { line: cm.firstLine(), ch: 0 };
//   if (!end) end = { line: cm.lastLine() + 1, ch: 0 };
//   var marker = cm.markText(start, end, { className: "styled-background" });
//   setTimeout(() => marker.clear(), 300);
// };

// const getLine = function() {
//   var c = cm.getCursor();
//   var s = cm.getLine(c.line);
//   flashCode({ line: c.line, ch: 0 }, { line: c.line + 1, ch: 0 });
//   return s;
// };

// const getCurrentBlock = function () { // thanks to graham wakefield + gibber
//   var editor = cm
//   var pos = editor.getCursor()
//   var startline = pos.line
//   var endline = pos.line
//   while (startline > 0 && cm.getLine(startline) !== '') {
//     startline--
//   }
//   while (endline < editor.lineCount() && cm.getLine(endline) !== '') {
//     endline++
//   }
//   var pos1 = {
//     line: startline,
//     ch: 0
//   }
//   var pos2 = {
//     line: endline,
//     ch: 0
//   }
//   var str = editor.getRange(pos1, pos2)

//   flashCode(pos1, pos2)

//   return str
// }


// {
//   // init
//   const code = cm.getValue();
//   hydra.eval(code);
// }

// window.onkeydown = e => {
//   if (cm.hasFocus()) {
//     if (e.keyCode === 13) {
//       e.preventDefault();
//       if (e.ctrlKey === true && e.shiftKey === true) {
//         // ctrl - shift - enter: evalAll
//         const code = cm.getValue();
//         flashCode();
//         hydra.eval(code);
//       } else if (e.ctrlKey === true && e.shiftKey === false) {
//         // ctrl - enter: evalLine
//         const code = getLine();
//         hydra.eval(code);
//       } else if (e.altKey === true) {
//         // alt - enter: evalBlock
//         const code = getCurrentBlock();
//    console.log(code)
//         hydra.eval(code);
//       }
//     }
//   }
// };
