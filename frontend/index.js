// import htmx from "htmx.org";
// import 'htmx.org/dist/ext/preload.js';
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
      you are the
        <span hx-post="/api/counter" hx-trigger="load">
          loading
        </span>th visitor
      <div id="parent-div"></div>
      <button hx-post="/api/clicked"
        hx-trigger="click"
        hx-target="#parent-div"
        hx-swap="outerHTML"
      >
        Click Me!
      </button>

      <div hx-post="/api/clicked" hx-trigger="click">Click Me</div>
      <script src="https://unpkg.com/htmx.org@1.9.6" />
    </div>
  `;
});

app.use((state, emitter) => {
  state.data = { data: "no data yet"}
});

// start app
app.mount("#choomount");

app.emitter.on("DOMContentLoaded", () => {
})
