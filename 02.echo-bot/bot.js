// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const chatComplitionAPI = require("./chatgptApiHelper/chatgptHelper");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const axios = require("axios");
const fs = require("fs");
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const {
  ActivityHandler,
  ActionTypes,
  ActivityTypes,
  CardFactory,
  MessageFactory,
} = require("botbuilder");
class EchoBot extends ActivityHandler {
  constructor() {
    super();
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      //chat complition api
      let replyText = await chatComplitionAPI.chatGptApi(context.activity.text);
      let reply = JSON.parse(replyText);
      replyText = reply.choices[0].message.content;

      if (replyText != null && replyText != undefined && replyText != "") {
        await context.sendActivity(MessageFactory.text(replyText, replyText));
      } else {
        await context.sendActivity(
          MessageFactory.text(
            "Iam having trouble communicating with the servers please try again later"
          )
        );
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const name = context.activity.from.name;
      const welcomeText =
        "Hello " +
        name +
        "Welcome to the OpenAI chatbot. Iam a chatbot trained on the GPT-3 model. I can talk about anything you want.";
      for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          await context.sendActivity(
            MessageFactory.text(welcomeText, welcomeText)
          );
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports.EchoBot = EchoBot;

async function downloadAndSaveMP3(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    fs.writeFileSync(filePath, buffer);
    console.log("MP3 audio saved:", filePath);
  } catch (error) {
    console.error("Error downloading or saving the MP3 audio:", error.message);
  }
}
