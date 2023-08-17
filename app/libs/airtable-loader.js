import Airtable from "airtable";

export default class AirtableLoader {
  constructor(key, baseName) {
    this.elements = [];
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: key
    });
    this.base = Airtable.base(baseName);
  }
  load(loadCallback, doneCallback) {
    let first = true;

    this.base("Table 1")
    .select({
      pageSize: 100,
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
          // el.created = new Date(e.fields.Created);
          el.notes = e.fields.Notes === undefined ? "" : e.fields.Notes;
          el.image = "";
          el.audio = "";
          if (e.fields.Attachments) {
            for (let i = 0; i < e.fields.Attachments.length; i++) {
              // el.image = e.fields.Attachments[i].url;
              if (e.fields.Attachments[i].thumbnails !== undefined) {
                if (e.fields.Attachments[i].thumbnails.large) {
                  el.image = e.fields.Attachments[i].thumbnails.large.url;
                  break;
                }
              }
              else {
                el.audio = e.fields.Attachments[i].url;
              }
            }
          }
          return el;
        });
        this.elements.push(...r);
        if (loadCallback !== undefined) {
          loadCallback(r);
        }

        // emitter.emit("tablePageLoaded")
        if (first) {
          first = false;
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