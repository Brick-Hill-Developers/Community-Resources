# How to use Discord.js

## Installation:
Install Discord:
```bash 
npm i discord.js
```


Edit your sandbox so it looks like this:
```js
sandbox: {
	Discord: require("discord.js");
},
```

Go to https://discordapp.com/developers/applications

Create a new application and make it a bot.

Finally. Put the bot token in  the script as it says:

`bot.login("Token should go here")`

Enable developer mode in apperance settings. 

Select the channel you want the bot to send messages and copy the id. Put this id in:
```js
var c = `channel id here`
```
