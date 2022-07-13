const fetch = require('node-fetch');

const { apiEndpoint } = process.env;

module.exports = {
  keywords: ['codegpt'],
  prefixes: ['code'],
  suffixes: ['//'],

  /**
   * @description Executes when it is triggered by trigger handler.
   * @param {Object} message The Message Object of the trigger.
   * @param {String[]} args The Message Content of the received message
   * seperated by spaces (' ') in an array
   */

  // edit code
  async execute(message, args) {
    console.log('Request: ', message.toString());
    const requestMsg = message.toString().replace('//', '').replace('code', '');

    const data = {
      code: requestMsg,
      max_length: process.env.max_length,
    };

    const responseBody = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseJson = await responseBody.json();

    const responseText = responseJson.text;

    console.log('Response: ', responseText, typeof responseText);
    message.reply({
      content: responseText,
    });
  },
};
