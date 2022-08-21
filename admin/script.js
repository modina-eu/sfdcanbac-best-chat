/* global Torus jdom css */

class Marker extends Torus.StyledComponent {
  init({tag, data, end}, parent) {
    this.duration = 0;
    if (end !== undefined) {
      this.duration = end - data.time;
    }
    this.scale = 30;
    this.tag = tag;
    this.data = data;
    this.parent = parent;
    this.note = "";
    this.className = tag;
    let { mouseMoving, keyTyping } = data;
    this.mouse = mouseMoving;
    this.key = keyTyping;
    if (tag == "keepalive") {
      // this.className = "";
    }
    if (tag == "dialog" && data.state === false) {
      this.className = "";
    }
    
    if (tag == "camfail") {
      this.note = "failed";
    }
    if (tag == "button") {
      this.effect = data.name;
    }
    if (tag == "slider" && data.state == "up") {
      this.slider = Math.round(data.value * 10) / 10;
    }

    const T = () => Math.round(data.time * 10) / 10 + " s";
    switch(tag) {
      case "loaded":
        this.description = `${T()}: ${tag}`;
        break;
      case "keepalive":
        this.description = `${T()}: ${mouseMoving ? "mouse interaction" : ""} / ${keyTyping ? "key interaction" : ""}`;
        break;
      case "button":
        this.description = `${T()}: ${tag} ${data.name}`;
        break;
      case "camfail":
        this.description = `${T()}: ${tag} ${JSON.stringify(data.msg)}`;
        break;
      case "slider":
        this.description = `${T()}: ${tag} ${data.state} ${data.state == "up" ? "to" : "from"} ${data.value}`;
        break;
      default:
        this.description = `${T()}: ${tag}`;
        break;
    }

  }
  styles() {
    return css`
    position: absolute;
    height: 125px;
    cursor: pointer;
    marker {
      position: absolute;
      width: 3px;
      height: 25px;
    }
    .loaded {
      background-color: black;
    }
    .mouse {
      position: absolute;
      width: ${1 * this.scale}px;
      top: 75px;
      height: 25px;
      background-color: lime;
    }
    .key {
      position: absolute;
      width: ${1 * this.scale}px;
      top: 100px;
      height: 25px;
      background-color: blue;
    }
    .dialog {
      position: absolute;
      width: ${this.duration * this.scale}px;
      top: 125px;
      height: 25px;
      background-color: purple;
    }
    .effect {
      position: absolute;
      width: ${(this.duration) * this.scale}px;
      top: 25px;
      height: 25px;
    }
    .sliderrange {
      position: absolute;
      width: ${(this.duration) * this.scale}px;
      top: 50px;
      height: 25px;
    }
    .shift {
      background-color: #fcf;
    }
    .kaleido {
      background-color: #ffc;
    }
    .thermo {
      background-color: #ccf;
    }
    .luma {
      background-color: #cff;
    }
    .keepalive {
      width: 1px;
      height: 5px;
      background-color: black;
    }
    .button {
      background-color: salmon;
    }
    .slider {
      background-color: plum;
    }
    .camfail {
      background-color: black;
      color: yellow;
      width: auto;
    }
    `
  }
  compose() {
    let tag = this.tag;
    let data = this.data;
    let note = this.note;

    return jdom`
      <entry
        style="left: ${data.time * this.scale}px"
      >
        <marker
          onmouseenter=${() => {
            if (tag !== "keepalive") {
              this.parent.description = this.description;
              this.parent.render();
            }
          }}
          class="${this.className}"
        >${note}</marker>
        ${
          this.effect !== undefined ? jdom`<div class="effect ${this.effect}">${this.effect}</>` : ""
        }
        ${
          this.slider !== undefined ? jdom`<div style="background-color: rgba(0, 0, 255, ${this.slider});" class="sliderrange">${this.slider}</>` : ""
        }
        <div class="${this.mouse && "mouse"}"
          onmouseenter=${() => {
            this.parent.description = this.description;
            this.parent.render();
          }}></>
        <div class="${this.key && "key"}"
          onmouseenter=${() => {
            this.parent.description = this.description;
            this.parent.render();
          }}></>
      </entry>`;
  }
}

class Timeline extends Torus.StyledComponent {
  init(data, duration) {
    this.data = data;
    this.duration = duration;
    this.markers = [];
    this.description = " ";
    this.processed = false;
  }
  process() {
    let data = this.data;
    let duration = this.duration;
    // faking
    const initButton = { data: {}};
    initButton.tag = "button";
    initButton.data.name = "shift";
    initButton.data.time = data[0].data.time;
    
    const initSlider = { data: {}};
    initSlider.tag = "slider";
    initSlider.data.state = "up";
    initSlider.data.value = 0.5;
    initSlider.data.time = data[0].data.time;

    const initDialog = { data: {}};
    initSlider.tag = "dialog";
    initSlider.data.state = true;
    initSlider.data.time = data[0].data.time;
    
    data = [initButton, initSlider, initDialog, ...data];
    
    // this.data = data;
    // this.duration = duration;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].tag === "slider" && data[i].data.state === "up") {
        data[i].end = duration;
        for (let j = i + 1; j < data.length; j++) {
          if (data[j].tag === "slider" && data[j].data.state === "down") {
            data[i].end = data[j].data.time;
            break;
          }
        }
      }

      if (data[i].tag === "button") {
        data[i].end = duration;
        for (let j = i + 1; j < data.length; j++) {
          if (data[j].tag === "button") {
            data[i].end = data[j].data.time;
            break;
          }
        }
      }

      if (data[i].tag === "dialog") {
        data[i].end = duration;
        for (let j = i + 1; j < data.length; j++) {
          if (data[j].tag === "dialog" && data[j].data.state === !data[i].data.state) {
            data[i].end = data[j].data.time;
            break;
          }
        }
      }
    }
    
    this.markers = data.map(e => new Marker(e, this));
    this.processed = true;
  }
  styles() {
    return css`
    margin: 1em 0;
    .timeline {
      position: relative;
      height: 175px;
      margin: 1em 0 1em;
      overflow-x: scroll;
    }
    .button {
      cursor: pointer;
      font-weight: bold;
    }
    .description {
      height: 1em;
    }
    position: relative;
    .note {
      position: absolute;
      bottom: -1em;
      font-size: .8em;
    }
    `
  }
  compose() {
    const timeline = this.processed ? jdom`
    <div class="timeline">
      ${this.markers.map(e => e.node)}
    </div>
    ` : jdom`
    <div class="timeline button" onclick=${() => {
      this.process();
      this.render();
    }}>
      open
    </div>
    `;

    return jdom`
    <div>
      ${ timeline }
      <div class="description">
        ${ this.description }
      </div>
    </div>`;
  }
  render() {
    super.render();
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1
    }

    let observer = new IntersectionObserver((entries, observer) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          // console.log(entries)
          if (this.processed === false) {
            this.process();
            this.render();
          }
        }
      }
    }, options);
    observer.observe(this.node);
  }
}

class Session extends Torus.StyledComponent {
  init(data) {
    this.data = data;
    this.userAgent = "";
    this.timezone = "";
    this.timestamp = "";
    this.resolution = "";
    this.reconnect = false;
    let loaded = data.find(e => e.tag === "loaded");
    if (loaded !== undefined) {
      this.userAgent = loaded.data.userAgent;
      this.timezone = loaded.data.timezone;
      this.timestamp = new Date(loaded.data.startT).toString();
      this.reconnect = !!loaded.data.reconnect;
      if (loaded.data.resolution !== undefined) {
        this.resolution = `${loaded.data.resolution[0]}x${loaded.data.resolution[1]}`
      }
    }
    this.ip = "";
    let ip = data.find(e => e.tag === "ip");
    if (ip !== undefined) {
      this.ip = ip.data.ip;
    }
    this.geoip = "";
    let geoip = data.find(e => e.tag === "geoip");
    if (geoip !== undefined) {
      this.geoip = jdom`<div style="display: inline">${geoip.data.city}, ${geoip.data.region}, ${geoip.data.country}</div>`;
    }
    this.duration = 0;
    if (data.length > 0) {
      this.duration = data[data.length - 1].data.time;
    }
    this.timeline = new Timeline(data, this.duration);
  }
  styles() {
    return css`
    margin: 2em 0 2em;
    .cat {
      font-weight: bold;
    }
    .bar {
      height: 3px;
      width: 100%;
      box-sizing: border-box;
    }
    .bar-in {
      height: 100%;
      background-color: black;
    }
    .metadata {
    }
    `
  }
  compose() {
    return jdom`<div>
      <div class="metadata">
        <div>
          <span class=cat>User Agent</span>: ${this.userAgent}
        </div>
        <div>
          <span class=cat>Resolution</span>: ${this.resolution}
        </div>
        <div>
          <span class=cat>Location</span>: ${this.geoip}
        </div>
        <div>
          <span class=cat>IP Address</span>: ${this.ip}
        </div>
        <div>
          <span class=cat>Timezone</span>: ${this.timezone}
        </div>
        <div>
          <span class=cat>Date</span>: ${this.timestamp}
        </div>
        <div>
          <span class=cat>Duration</span>: ${Math.round(this.duration)} sec
        </div>
      </div>
      <div>
        ${this.timeline.node}
      </div>
      <div class="bar"><div class="bar-in"></div></div>
    </div>`;
  }
  loaded() {
  }
}

class SessionApp extends Torus.StyledComponent {
  init() {
    this.sessions = [];
    this.rawData = [];
    this.dates = [];
    this.dateNodes = [];
    this.selectedDate = "";

    fetch('/api/logs')
    .then(response => response.json())
    .then(({data}) => {
      data = data.reverse();
      this.rawData = data.filter(d => d.find(e => e.tag === "loaded"));
      this.dates = this.rawData.map(d => {
        const startT = d.find(e => e.tag === "loaded").data.startT;
        return new Date(startT).toDateString();
      });
      this.dates = this.dates.filter((value, index, self) => self.indexOf(value) === index)
      console.log(this.dates)

      if (this.dates.length > 0) {
        this.generate(this.dates[0]);
      }
      this.render();
    });
  }
  generate(date) {
    this.selectedDate = date;
    this.sessions = this.rawData.filter(d => {
      const startT = d.find(e => e.tag === "loaded").data.startT;
      return date === new Date(startT).toDateString();
    }).map(d => new Session(d));
  }
  styles() {
    return css`
    a {
      color: blue;
    }
    a.selected {
      color: black;
      text-decoration: none;
    }
    `;
  }
  compose() {
    this.dateNodes = this.dates.map(d => {
      return jdom`<div><a href="#" class=${ this.selectedDate === d && "selected" } onclick=${() => {
        this.generate(d);
        this.render();
      }}>${d}</a></div>`
    });

    return jdom`
    <div>
      <div>
        ${this.dateNodes}
      </>
      <div>
        ${this.sessions.map(e => e.node)}
      </>
    </>`;
  }
  loaded() {
  }
}

class App extends Torus.StyledComponent {
  init() {
    this.sessionApp = new SessionApp();
  }
  styles() {
    return css`
      display: flex;
      justify-content: center;
      .container {
        width: 100%;
        max-width: 1280px;
      }
    `;
  }
  compose() {
    return jdom`
    <div class="wrapper">
      <div class="container">
        <h1>#Admin</h1>
        ${ this.sessionApp.node }
      </div>
    </>`;
  }
  loaded() {
  }
}

const app = new App();
document.querySelector("div#app").appendChild(app.node);
app.loaded();
