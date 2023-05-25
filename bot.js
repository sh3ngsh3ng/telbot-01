const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

let bot;

const token = process.env.API_KEY


if (process.env.NODE_ENV === 'SERVER') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.SERVER + token);
    console.log("Bot is live")
} else {
    bot = new TelegramBot(token, { polling: true })
}


console.log(`Bot is started in the ${process.env.NODE_ENV} mode`);

bot.on('message', async (msg) => {
    if (msg.text == '/start') {
        bot.sendMessage(
            msg.chat.id,
            `
            Hello!\nHow may I help you today?
            `
        )
    }
})


module.exports = bot