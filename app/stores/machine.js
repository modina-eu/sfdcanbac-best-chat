import {html} from "../content.md";

export default (state, emitter) => {
  state.dialog = false;
  // fetch(content)
  //   .then(response => response.text())
  //   .then(text => {
  //   state.content = text
  // });
  state.content = html;
  emitter.on("show info", () => {
    state.dialog = true;
    emitter.emit("render");
  });
  emitter.on("hide info", () => {
    state.dialog = false;
    emitter.emit("render");
  });
  
  state.theme = "paper";
  
  emitter.on("set theme", ({ theme }) => {
    state.theme = theme;
    emitter.emit("render");
  })
  
  state.history = [];
  
  emitter.on("jump", (id) => {
    state.history.push(state.currentData);
    state.currentData = state.airtableData[id];
    emitter.emit("render");
  });
  emitter.on("back", () => {
    if (state.history.length > 0) {
      state.currentData = state.history[state.history.length - 1];
      state.history.pop();
      emitter.emit("render");
    }
  });
}