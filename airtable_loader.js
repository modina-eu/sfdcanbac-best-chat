const Airtable = require('airtable');
module.exports = class AirtableLoader {
  constructor(key, baseName) {
    this.elements = [];
    this.base = new Airtable({ apiKey: key }).base(baseName);
  }
  load(loadCallback, doneCallback) {
    this.base("Table 1")
    .select({
      pageSize: 30,
      view: "Gallery",
    })
    .eachPage(
      (records, fetchNextPage) => {
        // records.forEach((record) => {
        //   console.log(record.fields);
        // });

        const r = records.map((e) => {
          const el = {};
          el.id = e.id;
          el.name = e.fields.Name;
          el.created = new Date(e.fields.Created);
          el.notes = e.fields.Notes === undefined ? "" : e.fields.Notes;
          el.description = e.fields.Description === undefined ? "" : e.fields.Description;
          el.insights = e.fields.Insights === undefined ? "" : e.fields.Insights;
          // .replace(/(<a )/g, `$1 target="_blank" `);
          el.type = e.fields.Type;
          el.hidden = e.fields.Hidden;
          el.image = "";
          el.color = e.fields.Color;
          el.alt = e.fields.Alt;
          if (e.fields.Attachments) {
            for (let i = 0; i < e.fields.Attachments.length; i++) {
              el.image = e.fields.Attachments[i].url;
              if (e.fields.Attachments[i].thumbnails !== undefined) {
                if (e.fields.Attachments[i].thumbnails.large) {
                  el.image = e.fields.Attachments[i].thumbnails.large.url;
                  break;
                }
              }
            }
          }
          el.related = e.fields.Related;
          return el;
        });
        this.elements.push(...r);
        if (loadCallback !== undefined) {
          loadCallback(r);
        }

        fetchNextPage();
      },
      (err) => {
        if (doneCallback !== undefined) {
          doneCallback();
        }
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  }
}
