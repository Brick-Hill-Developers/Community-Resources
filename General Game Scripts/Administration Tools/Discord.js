const bot = new Discord.Client({disableEveryone: false});
bot.login("place here"); //Bot Token
var c = 'place here'; //chennel ID

//npm i discord.js
//Don't forget to add discord.js to sandbox!

function hook(channel, title, message, id, color, avatar) { // This function uses quite a few options. The last 2 are optional.

    // Reassign default parameters - If any are blank.
    if (!channel) return console.log('Channel not specified.');
    if (!title) return console.log('Title not specified.');
    if (!id) return console.log('Player not specified');
    if (!message) return console.log('Message not specified.');
    if (!color) color = 'd9a744'; // This is an optional variable. Therefore the default HEX color will be whatever you post there. Mine will be d9a744
    if (!avatar) avatar = 'https://brkcdn.com/images/avatars/'+id.img+'.png' // This is also an optional variable, you can change the default to any icon.

    // We want to remove spaces from color & url, since they might have it on the sides.
    color = color.replace(/\s/g, '');
    avatar = avatar.replace(/\s/g, '');

    // This is the start of creating the webhook
    channel.fetchWebhooks() // This gets the webhooks in the channel
        .then(webhook => {

            // Fetches the webhook we will use for each hook
            let foundHook = webhook.find(x => x.name === "SDB") // You can rename 'Webhook' to the name of your bot if you like, people will see if under the webhooks tab of the channel.

            // This runs if the webhook is not found.
            if (!foundHook) {
                channel.createWebhook("SDB", 'http://lh6.googleusercontent.com/-d3UBdVlclYE/T_s2pyG8J4I/AAAAAAAAGTo/5fiMHeKz24g/s1600/Cool-Cat-Picture-2.jpg') // Make sure this is the same thing for when you search for the webhook. The png image will be the default image seen under the channel. Change it to whatever you want.
                    .then(webhook => {
                        // Finally send the webhook
                        webhook.send('', {
                            "username": title,
                            "avatarURL": avatar,
                            "embeds": [{
                                "color": parseInt(`0x${color}`),
                                "description":message
                            }],
                            timestamp: new Date(),
                            footer: {
                              text: title,
                              icon_url: 'http://lh6.googleusercontent.com/-d3UBdVlclYE/T_s2pyG8J4I/AAAAAAAAGTo/5fiMHeKz24g/s1600/Cool-Cat-Picture-2.jpg',
                            }
                        })
                            .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                                console.log(error);
                                return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                            })
                    })
            } else { // That webhook was only for if it couldn't find the original webhook
                foundHook.send('', { // This means you can just copy and paste the webhook & catch part.
                    "username": title,
                    "avatarURL": avatar,
                    "embeds": [{
                        "color": parseInt(`0x${color}`),
                        "description":message
                    }],
                    timestamp: new Date(),
                    footer: {
                      text: title,
                      icon_url: 'http://lh6.googleusercontent.com/-d3UBdVlclYE/T_s2pyG8J4I/AAAAAAAAGTo/5fiMHeKz24g/s1600/Cool-Cat-Picture-2.jpg',
                    }
                })
                    .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                        console.log(error);
                        return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                    })
                }

        })

}

//sends messages in brick hill to discord
Game.on('chatted', async(caller, msg) => {
  // bot.channels.get(c).send(caller.username +": "+ msg)
  const data = await caller.getUserInfo()
  hook(bot.channels.get(c), "OwO | "+caller.username, msg, data);
})

//sends message when player join the game to discord
Game.on('playerJoin', (p) => {
  bot.channels.get(c).send(`${p.username} joined the game`);
  bot.user.setActivity(`${Game.playerCount} players!`, {type: "WATCHING"});
})

//sends message when player left the game to discord
Game.on('playerLeave', (p) => {
  bot.channels.get(c).send(`${p.username} left the game`);
  bot.user.setActivity(`${Game.playerCount} players!`, {type: "WATCHING"});
})

//sends messages in discord to brick hill
bot.on("message", async message => {
  if(message.channel.id === c) {
  if(message.author.bot) return;

  console.log(`(discord) ${message.author.username}: `+ message.content);
  Game.messageAll(`\\c4(discord) ${message.author.username}: \\c0`+ message.content);
}
})

bot.on('error', console.error)


bot.on('ready', () => {
    // We can post into the console that the bot launched.
    console.log('Bot started.');
});

bot.on('error', console.error)
