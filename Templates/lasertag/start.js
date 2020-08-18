const nh = require('node-hill')

nh.startServer({
    gameId: 12281, // Your game id here

    port: 42480, // Your port id here (default is 42480)

    local: false, // Whether or not your server is local

    map: './lobby2.brk',
    
    scripts: './user_scripts', // Your .js files location

    sandbox: {aabb:require("aabb-3d")} // Your npm modules you want to add to the VM 

    // For more help: https://meta_data.gitlab.io/node-hill/interfaces/gamesettings.html
})
