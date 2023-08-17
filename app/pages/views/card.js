import html from "choo/html";
import { css } from "@emotion/css";

const mainCss = css`
`;

// export module
export default function(state, emit, item) {
  const links = [];
  if (item.links !== undefined) {
    for (const id of item.links) {
      links.push(formatLink(id));
    }
  }

  return html`
    <div class=${ mainCss }>
      <div>
        ${ item.name }
      </div>
      <div>
        ${ item.notes }
      </div>
      <div>
        ${ links }
      </div>
      <div>
        <span onclick=${ () => backClick() }>
          Back
        </span>
      </div>
    </div>
  `;
  
  function formatLink(id) {
    return html`
    <span onclick=${ () => linkClick(id) }>
      ${ state.airtableData[id].name }
    </span>
    `;
  }
  
  function linkClick(id) {
    emit("jump", id);
  }

  function backClick() {
    emit("back");
  }
}
