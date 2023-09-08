const config = {
    // Uses the PORT variable declared here, the path is defined in code
    port: 3000,
    redirectUri: 'https://airtable-cards.glitch.me/airtable-oauth',
    clientId: "cddf2489-8ccf-4b1f-9bbb-f947dee3e637",
    // If you're not using a client secret, set to the empty string: ""
    clientSecret: "",
    airtableUrl: 'https://www.airtable.com',
    // space delimited list of Airtable scopes, update to the list of scopes you want for your integration
    scope: 'data.records:read schema.bases:read',
};
export default config;