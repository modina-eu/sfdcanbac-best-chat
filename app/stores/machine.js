export default (state, emitter) => {
  state.dialog = false;
  emitter.on("toggleDialog", () => {
    state.dialog = !state.dialog;
  });
}