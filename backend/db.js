import { AceBase } from "acebase";
const options = { logLevel: 'warn', storage: { path: '.' } }; // optional settings
const db = await new AceBase('../.data/chatdb', options);  // Creates or opens a database with name ".mydb"

export default db;
