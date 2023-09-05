// import choo
import choo from "choo";
import html from "choo/html";

import machine from "./stores/machine.js";
import docs from "./stores/docs.js";
import airtable from "./stores/airtable.js";

// initialize choo
const app = choo({ hash: true });
app.use(machine);
app.use(docs);
app.use(airtable);

app.route("/*", notFound);

function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}

// import a template
import mainView from "./pages/main.js";
import listView from "./pages/list.js";
import cardView from "./pages/card.js";

app.route("/", mainView);
app.route("/list", listView);
app.route("/card/:name", cardView);
app.route("/doc/:key", mainView);

// start app
app.mount("#choomount");
