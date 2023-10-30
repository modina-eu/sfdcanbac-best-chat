import Airtable from "airtable";

export default class AirtableLoader {
  constructor(key, baseName, tableName, viewName) {
    this.elements = [];
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: key
    });
    this.base = Airtable.base(baseName);
    this.tableName = tableName;
    this.viewName = viewName;
  }
  async load(loadCallback, doneCallback) {
    this.elements = [];
    await this.base(this.tableName)
    .select({
      pageSize: 100,
      view: this.viewName,
    })
    .eachPage(
      async (records, fetchNextPage) => {
        const r = records.map((e) => {
          try {
            const el = {};
            el.id = e.id;
            for (const key of Object.keys(e.fields)) {
              el[key.toLocaleLowerCase()] = e.fields[key] === undefined ? "" : e.fields[key];
            }
            el.image = "";
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
            return el;
          } catch (err) {
            console.error(err);
          }
        });
        this.elements.push(...r);
        if (loadCallback !== undefined) {
          await loadCallback(r);
        }

        try { // HERE
          await fetchNextPage();
        } catch { return; }
      }
    )

    this.elements.reverse()
  }
}