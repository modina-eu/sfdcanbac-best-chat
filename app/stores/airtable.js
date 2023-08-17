import AirtableLoader from "../libs/airtable-loader.js";

export default (state, emitter) => {
  const airtableLoader = new AirtableLoader(
    "pat0Es1dY81qJYLYt.67d298ef8e547647e2f0a7a3308a0c9137863ede02ae657696fd2875148b95a1",
    "appT51yT4NvPGiBFA"
  );
  const data = [];
  airtableLoader.load(
    // every
    (r) => {
      for (const el of r) {
        data.push(el);
      }
    },
    // done
    () => {
      state.airtableData = data;
      console.log(data)
      state.msg = "oii";
      emitter.emit("render");
    }
  );
}