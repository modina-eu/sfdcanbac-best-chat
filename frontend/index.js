// import choo
import choo from "choo";
import html from "choo/html";

// initialize choo
const app = choo({ hash: true, href: false });

app.route("/*", notFound);

import machine from "./stores/machine.js";
app.use(machine);


function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}

import mainView from "./pages/main.js";
app.route("/", mainView);

// start app
app.mount("#choomount");
