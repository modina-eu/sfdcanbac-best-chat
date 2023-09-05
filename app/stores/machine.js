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
  
  function parseParams() {
    const { name } = state.params;
    if (name !== undefined) {
      const keys = Object.keys(state.airtableData);
      const ids = keys.filter(key => state.airtableData[key].name == name);
      if (ids.length > 0) {
        const id = ids[Math.floor(Math.random() * ids.length)];
        state.history.push(state.currentData);
        state.currentData = state.airtableData[id];
      }
    }
    emitter.emit("render");
  }

  emitter.on("airtable loaded", parseParams);
  emitter.on("navigate", () => {
    // nooooo
    setTimeout(() => 
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      }), 100);
  });
  
  state.theme = "windows";//"paper";
  
  emitter.on("set theme", ({ theme }) => {
    state.theme = theme;
    emitter.emit("render");
  });
}