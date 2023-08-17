export default (state, emitter) => {
  state.history = [];
  state.dialog = false;
  
  emitter.on("show info", () => {
    state.dialog = true;
    emitter.emit("render");
  });
  emitter.on("hide info", () => {
    state.dialog = false;
    emitter.emit("render");
  });
  
  emitter.on("jump", (id) => {
    state.currentData = state.airtableData[id];
    emitter.emit("render");
  });
  emitter.on("back", (id) => {
    if (state.history.length > 0) {
      const lastId = state.currentData.id;
      state.currentData = state.history[state.history.length - 1];
      state.history.push(lastId);
      emitter.emit("render");
    }
  });
}