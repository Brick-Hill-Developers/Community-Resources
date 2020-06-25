Game.on("chat", async (player, message) => {
    if (player.admin) {
        Game.messageAll("[Brick Hill Admin] " + player.username + ": " + message)
    } else {
        if (player.userId == 1) {
            Game.messageAll("[MyNotSoImportantTag] " + player.username + ": " + message)
        }
    } else {
        Game.messageAll("[MyLessImportantTag] " + player.username + ": " + message)
    }
})
