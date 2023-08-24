import raw from "choo/html/raw";
import {html} from "../content.md";

export default (state, emitter) => {
  state.dialog = false;
  state.content = raw(html);
  emitter.on("show info", () => {
    state.dialog = true;
    emitter.emit("render");
  });
  emitter.on("hide info", () => {
    state.dialog = false;
    emitter.emit("render");
  });
  
  const findCard = () => {
    const { name } = state.params;
    const keys = Object.keys(state.airtableData);
    const id = keys.find(key => state.airtableData[key].name == name);
    console.log(id)
    if (id !== undefined) {
      state.history.push(state.currentData);
      state.currentData = state.airtableData[id];
    }
  }
  
  emitter.on("airtable loaded", () => {
    if (state.params.name) {
      findCard();
    }
    emitter.emit("render");
  })
  emitter.on("navigate", () => {
    findCard();
    emitter.emit("render");
  })
  
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