import htmx from "htmx.org";

// htmx.onLoad(function(elt){
//   console.log(elt)
// })

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
      lol
          <div hx-post="/api/clicked" hx-trigger="click">Click Me</div>

    </div>
  `;
});

app.use((state, emitter) => {
  state.data = { data: "no data yet"}
});

// start app
app.mount("#choomount");

