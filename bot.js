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

let tasklist = [
    {
        task_id: 1,
        task_name: "Fake Task 1",
    },
    {
        task_id: 2,
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
        if (tasklist.length == 0) {
            bot.sendMessage(
                msg.chat.id,
                `
You do not have any task currently!
Add tasks by using the /add command!
                `
            )
        } else {
            let tasksButtons = tasklist.map((task) => {
                return [
                    {
                        "text": task.task_name,
                        "callback_data": task.task_id
                    }
                ]
            })

            bot.sendMessage(msg.chat.id, `Below are your pending tasks:`,
                {
                    reply_markup: {
                        "inline_keyboard": tasksButtons
                    }
                }
            )
        }
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

    }

    else if (msg.text == '/delete') {

    }


})


module.exports = bot