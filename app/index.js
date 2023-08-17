// import choo
import choo from "choo";
import html from "choo/html";
import devtools from "choo-devtools";

// import socket from "./stores/socket.js";

// initialize choo
const app = choo({ hash: true });
// app.use(devtools())
// app.use(socket);

app.route("/*", notFound);

// const splash = urlParams.get("splash");

function notFound() {
  return html`
    <div>
      <a href="/"> 404 with love ❤ back to top! </a>
    </div>
  `;
}

// import a template
import mainView from "./views/main.js";

app.route("/", mainView);

// start app
app.mount("#choomount");
