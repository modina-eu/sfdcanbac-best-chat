import raw from "choo/html/raw";
import html from "choo/html";

export default (state, emitter) => {
  state.dialog = false;

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
    const ids = keys.filter(key => state.airtableData[key].name == name);
    console.log(ids)
    if (ids.length > 0) {
      const id = ids[Math.floor(Math.random() * ids.length)];
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
  
  state.theme = "windows";//"paper";
  
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