# How to use Discord.js

## Installation:
Install Discord:
```bash 
npm i discord.js
```


Edit your sandbox so it looks like this:
```js
modules: [
	'discord.js'
]
```

Go to https://discordapp.com/developers/applications

Create a new application and make it a bot.

Finally. Put the bot token in  the script as it says:

`bot.login("Token should go here")`

Enable developer mode in apperance settings. 

And that should be it, but before continuing on writing your script you'll need DiscordJS imported on your files.

It's as easy as:
```js
const discordJS = getModule('discord.js');

// rest of your discord bot interactivity here!
```
