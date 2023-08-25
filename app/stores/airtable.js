import AirtableLoader from "../libs/airtable-loader.js";

export default (state, emitter) => {
  state.airtableData = {};
  const airtableLoader = new AirtableLoader(
    "pat0Es1dY81qJYLYt.67d298ef8e547647e2f0a7a3308a0c9137863ede02ae657696fd2875148b95a1",
    "appT51yT4NvPGiBFA",
    "Table 1",
    "Gallery"
  );
  airtableLoader.load(
    // every
    (r) => {
      for (const el of r) {
        state.airtableData[el.id] = el;
        if (state.currentData === undefined) {
          state.currentData = el;
        }
      }
    },
    // done
    () => {
      // console.log(state.airtableData);
      emitter.emit("airtable loaded");
    }
  );
}