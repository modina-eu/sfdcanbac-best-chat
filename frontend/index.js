// import choo
import choo from "choo";
import html from "choo/html";
import htmx from "htmx.org";

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
app.route("/", mainView);

app.use((state, emitter) => {
  state.data = { data: "no data yet"}
});

// start app
app.mount("#choomount");

