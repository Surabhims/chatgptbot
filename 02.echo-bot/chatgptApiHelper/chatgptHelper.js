module.exports = {
  async chatGptApi(text) {
    return new Promise((resolve, reject) => {
      var request = require("request");
      var options = {
        method: "POST",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.7,
        }),
      };

      request(options, function (error, response, body) {
        if (error) {
          console.log("error while getting api response of create product");
          console.log(error);
          reject(error);
        } else {
          const json = body;
          resolve(json);
        }
      });
    });
  },
};
