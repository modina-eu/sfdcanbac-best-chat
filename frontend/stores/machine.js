import raw from "choo/html/raw";
import html from "choo/html";

export default (state, emitter) => {
  function loadData() {
    let o = {
      test: "oi"
    }
    fetch("/api/getdata", {
      method: "POST",
      body: JSON.stringify(o),
      headers: {
        "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => {
      state.data = data;
      emitter.emit("render");
    });
  }
  

  emitter.on("navigate", () => {
    loadData();
  });
  
  emitter.on("DOMContentLoaded", () => {
    loadData();
  });
}