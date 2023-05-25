function getAllTasks(bot, msg, tasklist, replyPrompt) {
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

        bot.sendMessage(msg.chat.id, replyPrompt,
            {
                reply_markup: {
                    "inline_keyboard": tasksButtons
                }
            }
        )
    }
}

function deleteTask(bot, msg, tasklist, replyPrompt) {
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

        bot.sendMessage(msg.chat.id, replyPrompt,
            {
                reply_markup: {
                    "inline_keyboard": tasksButtons
                }
            }
        ).then((payload) => {
            bot.once("callback_query", (callback) => {
                let indexToDelete = tasklist.findIndex(elem => elem.task_id == callback.data)
                tasklist.splice(indexToDelete, 1)
                bot.sendMessage(callback.message.chat.id, `You have deleted the task.`)
            })
        })
    }
}

function editTask(bot, msg, tasklist, replyPrompt) {
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

        bot.sendMessage(msg.chat.id, replyPrompt,
            {
                reply_markup: {
                    "inline_keyboard": tasksButtons
                }
            }
        ).then((payload) => {
            bot.once("callback_query", async (callback) => {
                let selectedTaskIndex = tasklist.findIndex(elem => elem.task_id == callback.data)
                const newPrompt = await bot.sendMessage(
                    msg.chat.id,
                    "Please add in the new task name!",
                    {
                        reply_markup: {
                            force_reply: true
                        }
                    }
                )

                bot.onReplyToMessage(
                    msg.chat.id,
                    newPrompt.message_id,
                    async (msg) => {
                        tasklist[selectedTaskIndex] = {
                            task_id: tasklist.length,
                            task_name: msg.text,
                        }
                        bot.sendMessage(msg.chat.id, `<b>[Task: ${msg.text}]</b> have been edited!`, {
                            parse_mode: "HTML"
                        })
                    }
                )
            })
        })
    }
}

module.exports = {
    getAllTasks, deleteTask, editTask
}