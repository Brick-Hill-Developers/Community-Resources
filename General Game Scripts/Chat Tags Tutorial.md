
# Chat Tags!

### Made by ggnoobgamingdeutsch

### Ported by Edge.

Languages:
`Javascript` in `NodeJS` Enviorment.

----

**Install Node-hill previously!**

---
Begin by making a JavaScript file in the scripts folder of our node-hill installation.
Open the file in your favorite text editor and being programming.

To begin we need to figure out when a player chats and what they typed so we can modify the message to include the chat tag. 
Luckily theres the function Game.on() that we can use to run code when a action is made.

Game.on() Usage:
```js
Game.on(event, returnedInfo) => { code to run here });
```
The "event" in our Game.on() in our script needs to be "chat". The returnedInfo needs to be async(palyer, message).

It should look like this: 
```js
Game.on("chat", async(player, message) => {});
```

Now we need to do if statements so we can mody the message correctly. 
Lets say i wan't to give Brick Hill admins a special tag. 
Node Hill has a admin property in the player object so we can check if player.admin equal true:
```js
if(player.admin){

};
``` 


Now we need to send the message to the chat. Node Hil has the messageAll function in the Game object: 
```js
Game.messageAll(message here) 
``` 
we need to include the message the player originally send to the server in the messageAll function and their username which can we get with the username property in the player object:
```js
player.username (returns a string)
```

So lets use it here:  
  ```js
if (player.admin) {
    Game.messageAll("[Brick Hill Admin] " + player.username + ": " + message)
}
```
o now we gave a special tag to brick hill admins! Wait why are players complaining they can't chat? Oh with the Game.on function we told Node-Hill that we are gonna take care of the chat so it won't send anything to the chat. Lets fix this:  
 ```js
if (player.admin) {
    Game.messageAll("[Brick Hill Admin] " + player.username + ": " + message)
} else {
    Game.messageAll("[Player] " + player.username + ": " + message)
}
```
  
Now if the player isn't an admin it will still be able to chat.  
Now to add multiple tags you need more if statements and else.  
Add the more important tags first and slowly go to the less important tags. Like this:  
 ````js
if (player.admin) {
    Game.messageAll("[Brick Hill Admin] " + player.username + ": " + message)
} else {
    if (player.userId == 1) {
        Game.messageAll("[MyNotSoImportantTag] " + player.username + ": " + message)
    }
} else {
    Game.messageAll("[MyLessImportantTag] " + player.username + ": " + message)
}
  ````
If you want to add color you need to type [HEX VALUE HERE] infront of the part you want to have colored. You need to the text white again before or after the player's username so that the entire chat message isn't colored.  
  
Thanks for reading my first tutorial. I might have something wrong so please check the replies first if theres a error for a possible solution.


**ALL THE CODE DOWN BELOW**

```js
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
```
