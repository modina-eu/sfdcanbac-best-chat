import raw from "choo/html/raw";
import html from "choo/html";

export default (state, emitter) => {
  state.dialog = false;
  state.navigateCount = 0;

  emitter.on("show info", () => {
    state.dialog = true;
    emitter.emit("render");
  });
  emitter.on("hide info", () => {
    state.dialog = false;
    emitter.emit("render");
  });

  emitter.on("airtable loaded", () => {
    emitter.emit("render");
  });

  emitter.on("pushState", () => {
    window.scrollTo(0, 0);
    state.navigateCount++;
  });
  
  emitter.on("popState", () => {
    state.navigateCount = Math.max(state.navigateCount - 1, 0);
  });

  state.theme = "windows";//"paper";
  
  emitter.on("set theme", ({ theme }) => {
    state.theme = theme;
    emitter.emit("render");
  });
}