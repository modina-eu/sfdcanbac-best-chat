const config = {
    // Uses the PORT variable declared here, the path is defined in code
    port: 3000,
    redirectUri: 'https://airtable-cards.glitch.me/airtable-oauth',
    clientId: "1193a826-6abb-4c8e-983f-773ac43c6dde",
    // If you're not using a client secret, set to the empty string: ""
    clientSecret: "",
    airtableUrl: 'https://www.airtable.com',
    // space delimited list of Airtable scopes, update to the list of scopes you want for your integration
    scope: 'data.records:read',
};
module.exports = config;