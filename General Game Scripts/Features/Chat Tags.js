Game.on("chat", async (player, message) => {
    if (player.admin){
        Game.messageAll("[BH Admin] "+ player.username+ ": "+ message)
    }

    else if (player.userId == 1){
        Game.messageAll("[Brickster!]"+ player.username+": "+message)

    }
    else {
        Game.messageAll("[IM not important]"+player.username+": "+message)
    }
});
