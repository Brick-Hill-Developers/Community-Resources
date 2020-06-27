// Silly r/place for Brick Hill. - made by lykaspars4

// Before

if (!Game.serverSettings.rplace)
    return;

// Variables

const rplaceServerSettings = Game.serverSettings.rplace;
const rplace = {};
rplace.timeouts = {}; // Let's make it fair. First, I will use userId instead of netId, and second, I will NOT reset it when player left the game. userId - [timeout, halt]
rplace.colors = rplaceServerSettings.colors || {
    "White (0%)": "#FFFFFF",
    "20%": "#C4C4C4",
    "Grey (40%)": "#888888",
    "60%": "#555555",
    "80%": "#222222",
    "Black (100%)": "#000000",
    "Bright Pink": "#FFA7D1",
    "Pink": "#EC08EC",
    "Dark Pink": "#820080",
    "Dark Red": "#6b0000",
    "Red": "#E50000",
    "Bright Red": "#FF3904",
    "Orange": "#E59500",
    "Yellow": "#ESD900",
    "Pale": "#FFDFCC",
    "Dark Pale": "#A06A42",
    "Brown": "#633C1F",
    "Bright Green": "#94E044",
    "Green": "#51E119",
    "Dark Green": "#02BE01",
    "Darker Green": "#006600",
    "Cyan": "#36BAFF",
    "Bright Blue": "#0083C7",
    "Blue": "#044BFF",
    "Dark Blue": "#0000EA"
};
rplace.timeout = rplaceServerSettings.timeout || 30;
rplace.offsetX = rplaceServerSettings.offsetX || 0;
rplace.offsetY = rplaceServerSettings.offsetY || 0;
rplace.width = rplaceServerSettings.width || 50;
rplace.height = rplaceServerSettings.height || 50;
rplace.pixelSize = rplaceServerSettings.pixelSize || 2;

// Functions

function getColorName(colorSelection) {
    return Object.getOwnPropertyNames(rplace.colors)[colorSelection];
}

function getColor(colorSelection) {
    return Object.values(rplace.colors)[colorSelection];
}

function objectLength(object) {
    return Object.keys(object).length;
}

function createPixel(x, y) {
    let pixelBrick = new Brick(new Vector3(x * rplace.pixelSize, y * rplace.pixelSize, 0), new Vector3(rplace.pixelSize, rplace.pixelSize, 1));
    Game.newBrick(pixelBrick);
    
    pixelBrick.setClickable(true);
    // console.log(pixelBrick.color);

    pixelBrick.clicked((player, secure) => {
        if (rplace.timeouts[player.userId][0] > 0 || !secure)
            return;
        
        pixelBrick.setColor(getColor(player.colorSelection));
        rplace.timeouts[player.userId][0] = rplace.timeout;
    });
}

function renderToPlayer(player) {
    player.bottomPrint(`[${getColor(player.colorSelection)}]${getColorName(player.colorSelection)} [#FFFFFF]| ${rplace.timeouts[player.userId][0]}`);
}

function createCanvas(offsetx, offsety, width, height) {
    for (let x = 0; x<width; x++) {
        for (let y = 0; y<height; y++) {
            createPixel(offsetx + x, offsety + y);
        }
    }
}

function timeoutTick() {
    Object.keys(rplace.timeouts).forEach(timeoutUser => {
        // console.log(`${timeoutUser}, ${rplace.timeouts}`);
        let timeout = rplace.timeouts[timeoutUser];
        if (timeout[0] > 0 && !timeout[1]) {
            timeout[0] -= 1;
        }
    });
}

function cycleColor(player, color) {
    player.colorSelection += color;
    if (player.colorSelection > objectLength(rplace.colors) - 1) {
        player.colorSelection = 0;
    } else if (player.colorSelection < 0) {
        player.colorSelection = objectLength(rplace.colors) - 1;
    }
    console.log(player.colorSelection);
}

// Callbacks

Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        player.colorSelection = 0;
        player.renderTick = setInterval(function() { renderToPlayer(player); }, 10);
        
        if (!rplace.timeouts[player.userId]) {
            rplace.timeouts[player.userId] = [rplace.timeout, false];
        } else {
            rplace.timeouts[player.userId][1] = false;
        }

        player.keypress((key) => {
            if (key == "q") {
                cycleColor(player, -1);
            } else if (key == "e") {
                cycleColor(player, 1);
            }
        });
    });
});

Game.on("playerLeave", (player) => {
    if (player.renderTick)
        clearInterval(player.renderTick);
    if (rplace.timeouts[player.userId])
        rplace.timeouts[player.userId][1] = true; // Put on halt!
});

// After

rplace.timeoutTick = setInterval(timeoutTick, 1000);

createCanvas(rplace.offsetX, rplace.offsetY, rplace.width, rplace.height);
