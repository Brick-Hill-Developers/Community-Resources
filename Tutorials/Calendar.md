# How to install the Roleplay Calendar.

##### Install Requirements (enmap)

`npm i enmap` - Do this on your Node-hill template.

##### Edit your Start.js file.

Your start.js file should look like this:

```js
const nh = require('node-hill')

nh.startServer({
    gameId: ID,// Your game id here

    port: 42480, // Your port id here (default is 42480)

    local: false, // Whether or not your server is local

    // map: './maps/mygame.brk', - Your .brk file location here
    
    scripts: './user_scripts', // Your .js files location

    sandbox: {
	     
}, // Your npm modules you want to add to the VM 

    // For more help: https://meta_data.gitlab.io/node-hill/interfaces/gamesettings.html
})
```

On "Sandbox {}," You need to change it so it looks like this:

```js
sandbox: {enmap: require("enmap")},
```


And you should be rolling! 
