// import htmx from "htmx.org";
// import choo
import choo from "choo";
import html from "choo/html";

// initialize choo
const app = choo({ hash: true, href: false });

app.route("/*", notFound);

function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}

import mainView from "./pages/main.js";
app.route("/", function () {
  return html`
    <div>
          <div id="parent-div"></div>
    <button hx-post="/api/clicked"
      hx-trigger="click"
      hx-target="#parent-div"
      hx-swap="outerHTML"
    >
      Click Me!
    </button>

          <div hx-post="/api/clicked" hx-trigger="click">Click Me</div>

    </div>
  `;
});

app.use((state, emitter) => {
  state.data = { data: "no data yet"}
});

// start app
app.mount("#choomount");

app.emitter.on("DOMContentLoaded", () => {
import 'htmx.org/dist/ext/preload.js';
})
