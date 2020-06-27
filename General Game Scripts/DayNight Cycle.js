const {rgbToHex} = require("node-hill/dist/util/color/color");

const dc = {};

dc.time = 0;
dc.skyColor = {};
dc.skyColor.day = [128 * 0.45, 128 * 0.45, 255 * 0.45];
dc.skyColor.night = [0, 0, 25];
dc.sunInt = {};
dc.sunInt.day = Game.world.environment.sunIntensity || 300;
dc.sunInt.night = 95;

console.log(Game.world.environment.sunIntensity);

function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}

function lerpTime(day, night) {
    return lerp(day, night, Math.sin(dc.time));
}

dc.tick = function() {
    dc.time += 0.0001;

    // console.log(Math.floor(lerpTime(dc.skyColor.day[0], dc.skyColor.night[0])));

    Game.setEnvironment({
        skyColor: rgbToHex(
            lerpTime(dc.skyColor.day[0], dc.skyColor.night[0]),
            lerpTime(dc.skyColor.day[1], dc.skyColor.night[1]),
            lerpTime(dc.skyColor.day[2], dc.skyColor.night[2])
        ),
        sunIntensity: lerpTime(dc.sunInt.day, dc.sunInt.night)
    });
};

dc.tickInterval = setInterval(dc.tick, 10);
