// MURDER - A game where you need to survive. Made by lykaspars4.
// WARNING - This code isn't clean, but you can help.

// BEFORE //

if (!Game.serverSettings.murder)
    return;

// VARIABLES //

const murder = {};
murder.gameState = 0; // 0 - Warmup, 1 - Started, 2 - Ended
murder.gameStates = {"Warmup": 0, "Started": 1, "Ended": 2};
murder.roles = {"Waiting/Dead": -1, "Innocent": 0, "Murderer": 1, "Sheriff": 2}; // -1 - Waiting/Dead, 0 - Innocent, 1 - Murderer, 2 - Sheriff 
murder.roundTime = 90;
murder.roundConfig = {
    "idleTime": 20,
    "startTime": 150
};

// FUNCTIONS //

// Role ID to name.
function roleName(id) {
    return Object.getOwnPropertyNames(murder.roles)[id];
}

// Game state to name.
function gameStateName(state) {
    return Object.getOwnPropertyNames(murder.gameStates)[state];
}

// Creates a knife and give it to player.
function createKnife() {
    let knife = new Tool("Knife");
    knife.model = 25566;

    knife.holded = false; // Lazy stupid bangla memory leak prevention.

    knife.on("activated", (player) => {
        for (let victim of Game.players) {
            if (Game.pointDistance3D(player.position, victim.position) < 5 && victim.netId != player.netId) {
                victim.kill(); // Get slashed instantly!
            }
        }
    });

    knife.on("equipped", (player) => {
        knife.holder = player;
        if (!knife.holded) {
            knife.holder.once("died", () => {
                knife.holder.unequipTool(knife); // I will use this because of glitch or bug, SMH.
                knife.holder.destroyTool(knife); // Please, for love of god. Add "Reset tools on spawn"!
            });
        }
        knife.holded = true;
    });

    return knife;
}

function createGun() {
    let gun = new Tool("Gun");
    gun.model = 11844;
    gun.holded = false;
    gun.loaded = true;

    gun.on("activated", (player) => {
        if (player && gun.loaded) {
            createBullet(player.rotation.z, player.position.add(0, 0, 3), gun.holder, 5000);
            gun.loaded = false;
            setTimeout(function(){gun.loaded = true;}, 2000);
        }
    });

    gun.on("equipped", (player) => {
        gun.holder = player;
        if (!gun.holded) {
            gun.holder.once("died", () => {
                gun.holder.unequipTool(gun);
                gun.holder.destroyTool(gun);
            });
        }
        gun.holded = true;
    });

    return gun;
}

function createBullet(direction, position, exclude, timeoutDestroy) {
    // Rule thought it was so bangla that I will do it anyways becAUSE OF PROJECTILE DOESN'T EXIST
    let bullet = new Brick(position, new Vector3(1, 1, 1), "#FFFF00");
    Game.newBrick(bullet);

    let bulletTouch = bullet.touching((player) => {
        if (player.netId != exclude.netId && player.murderRole == 1) {
            player.kill();
            destroy();
        }
    });

    let bulletTick = setInterval(function() {
        bullet.setPosition(bullet.position.add(1.75 * Math.sin(direction / -57.7), -1.75 * Math.cos(direction / -57.7), 0));
    }, 50);

    function destroy() {
        bulletTouch.disconnect();
        clearInterval(bulletTick);
        clearTimeout(timeoutBullet);
        bullet.destroy();
    }

    let timeoutBullet = setTimeout(destroy, timeoutDestroy); // It will be destroyed if it takes too long.
}

// Bangla teleportation!
function bringPlayerToBricks(player, brickName) {
    let bricks = Game.world.bricks.filter(brick => brick.name == brickName);
    if (player && bricks.length > 0) {
        let brickSelect = bricks[Math.floor(Math.random() * bricks.length)];
        player.setPosition(brickSelect.position);
    }
}

// Renders GUI to player.
function renderToPlayer(player) {
    if (player) {
        player.bottomPrint(`${roleName(player.murderRole)} | ${murder.roundTime} | ${gameStateName(murder.gameState)}`, 1);
    }
}

// Starts the round.
function startRound() {
    if (Game.players.length < 2) {
        Game.messageAll("[#FF0000]This game needs more than 1 player!");
        murder.gameState = 0;
        murder.roundTime = murder.roundConfig.idleTime;
        return;
    }

    murder.gameState = 1;
    murder.roundTime = murder.roundConfig.startTime;

    for (let player of Game.players) {
        if (!player) return;
        player.murderRole = 0; // Fill player's role with Innocent.
    }

    let innocentPlayers = Game.players.filter(player => player.murderRole == 0);
    let murdererPlayer = innocentPlayers[Math.floor(Math.random() * innocentPlayers.length)]; // Pick random player ...
    if (murdererPlayer) {
        murdererPlayer.murderRole = 1; // ... and turn into murderer
        murder.murderer = murdererPlayer;
        murdererPlayer.equipTool(createKnife());
    }

    innocentPlayers = Game.players.filter(player => player.murderRole == 0);
    let sheriffPlayer = innocentPlayers[Math.floor(Math.random() * innocentPlayers.length)];
    if (sheriffPlayer) {
        sheriffPlayer.murderRole = 2;
        murder.sheriff = sheriffPlayer;
        sheriffPlayer.equipTool(createGun());
    }

    for (let player of Game.players) {
        if (!player) return;
        player.centerPrint(`[#FF0000]You are now ${roleName(player.murderRole)}!`, 5); // Let every players know their role.
    }

    console.log("[Murder] Round starts!");
}

// Ends the round.
function endRound() {
    murder.gameState = 2;
    murder.roundTime = murder.roundConfig.idleTime;

    for (let player of Game.players) {
        if (!player) return;
        // Give survived players' score.
        if (player.murderRole != -1) {
            player.setScore(player.score += 1);
        }
        // Reset back into waiting/dead role.
        player.murderRole = -1;
        player.kill(); // Yes.
    }
    // Give players round summary.
    Game.messageAll("[#FFDE0A]--- ROUND ENDED ---");
    if (murder.murderer) {
        Game.messageAll(`[#FFDE0A]${murder.murderer.username || "..."} is the murderer!`);
    } else {
        Game.messageAll("[#FFDE0A]... Wait, there's no murderer?!");
    }
    Game.messageAll("[#FFDE0A]--- ROUND ENDED ---");
    console.log("[Murder] Round ended!");
}

// Have you ever heard of Counter-Strike: Global Offensive?
function warmup() {
    murder.gameState = 0;
    murder.roundTime = murder.roundConfig.idleTime;

    for (let player of Game.players)
        bringPlayerToBricks(player, "MSpawn");
}

// Tick. Tock. Tick.
function tickRound() {
    // Tick...
    murder.roundTime -= 1;
    if (murder.roundTime < 0) {
        murder.gameState += 1;
        switch(murder.gameState) {
            case 1:
                startRound();
                break;
            case 2:
                endRound();
                break;
            case 3:
                murder.gameState = 0;
                warmup();
                break;
        }
    }
    if (murder.gameState == 1) {
        // Check survivors left...
        let survivorSum = Game.players.filter(player => player.murderRole != -1).length;
        let murdererSum = Game.players.filter(player => player.murderRole == 1).length;
        // console.log(survivorSum + " - " + murdererSum);
        if (murdererSum < 1) { // If there's no murderer(s) left...
            Game.messageAll("[#00FF00]Innocent wins!");
            endRound();
        } else if ((survivorSum - murdererSum) < 1) { // If there's no survivor(s) left...
            Game.messageAll("[#FF0000]Murderer wins!");
            endRound();
        }
    }
}

// CALLBACKS //

// It fires when player joined the game.
Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        player.murderRole = -1;
        player.renderLoop = setInterval(function(){renderToPlayer(player);}, 950);
        player.loadTool = false;
        bringPlayerToBricks(player, "LSpawn");
        if (Game.players.length < 3) {
            endRound();
        }
    });

    player.on("respawn", () => {
        bringPlayerToBricks(player, "LSpawn");
        player.equipTool(createGun());
    });

    player.on("died", () => {
        player.murderRole = -1;
        player.centerPrint("[#FF0000]-= You died! =-", 5);
        console.log(`[Murder] ${player.username} died.`);
    });
});

Game.on("playerLeave", (player) => {
    clearInterval(player.renderLoop);
});

// It will intercept message to prevent unfair play. (Like, "OmG!!1 EpIcGaMeRWeEd420 KiLlEd EvErYOnE!!1!")
Game.on("chat", (player, message) => {
    if (player.murderRole == -1) {
        for (let playerSelect of Game.players) {
            if (playerSelect.murderRole == -1) {
                playerSelect.message(`[#FF0000]*DEAD* [#FFDE0A]${player.username}: [#FFFFFF]${message}`);
                console.log(`[Murder] ${player.username} sends a message when they died. (\"${message}\")`);
            }
        }
    } else {
        Game.messageAll(`[#FFDE0A]${player.username}: [#FFFFFF]${message}`);
    }
});

// AFTER //

console.log("[Murder] Starting round tick...");
murder.roundTick = setInterval(tickRound, 1000);
