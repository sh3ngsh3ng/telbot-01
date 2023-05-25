const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { getAllTasks, deleteTask, editTask } = require("./utilities-functions")

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

let tasklist = [
    {
        task_id: 0,
        task_name: "Fake Task 1",
    },
    {
        task_id: 1,
        task_name: "Fake Task 2",
    }
]

bot.on('message', async (msg) => {
    if (msg.text == '/start') {
        bot.sendMessage(
            msg.chat.id,
            `
Hello ${msg.chat.username}!
\nI am a demo bot! I act as a to-do list to keep track of your tasks!
\nHere are some of the commands you can try:
\n1) /tasklist
2) /add
3) /edit
4) /delete
            `
        )
    }

    else if (msg.text == '/tasklist') {
        let replyPrompt = `Below are your pending tasks:`
        getAllTasks(bot, msg, tasklist, replyPrompt)
    }


    else if (msg.text == '/add') {
        const taskPrompt = await bot.sendMessage(
            msg.chat.id,
            "Please type in the task to add!",
            {
                reply_markup: {
                    force_reply: true
                }
            }
        )

        bot.onReplyToMessage(
            msg.chat.id,
            taskPrompt.message_id,
            async (msg) => {
                await tasklist.push({
                    task_id: tasklist.length,
                    task_name: msg.text,
                })
                bot.sendMessage(msg.chat.id, `<b>[Task: ${msg.text}]</b> have been added to your tasklist!`, {
                    parse_mode: "HTML"
                })
            }
        )
    }

    else if (msg.text == '/edit') {
        editTask(bot, msg, tasklist, "Which task would you like to edit?")
    }

    else if (msg.text == '/delete') {
        // render tasks
        let replyPrompt = "Which of the following task would you like to delete?"
        deleteTask(bot, msg, tasklist, replyPrompt)
    }

})


module.exports = bot