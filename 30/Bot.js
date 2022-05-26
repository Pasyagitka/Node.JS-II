//It allows running application (chatbot) locally without any dedicated server and available external address
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('5142569991:AAEaXYxZNqYiwg2GJoWG-BYrLIfhEq4dSh8', {polling: true});

bot.onText(/(.)/, (msg) => {
    console.log(msg);
    bot.sendMessage(msg.chat.id, `echo: ${msg.text}`);
    bot.sendSticker(msg.chat.id, `CAACAgIAAxkBAAEDxf9h9Zc4Gw0x08MQmlx-LP6VOeHchgACsgIAAlrjihdLNcdarjiNByME`)
    //bot.sendSticker(msg.chat.id, `CAACAgIAAxkBAAEE0qVijx8u7vVh2mfhFv6TYEkqRmyAXQACVwADkp8eEa9KClr3JmwOJAQ`)
}
)

//whoami