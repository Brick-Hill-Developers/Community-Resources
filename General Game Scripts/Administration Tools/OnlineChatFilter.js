let url = "https://www.purgomalum.com/service/json?text="; // Online Service for web profanity filtering. 
let axios = getModule('axios'); // Axios module. You need to add it to modules array.
Game.on('chat', (p, msg) => { // When the player chats....
    axios.get(`${url}${msg}`) // we send a get request to the url + the message.
  .then(response => { // We pass the response to...
    msg = msg.replace(msg, response["result"]) // We replace the variable message from the chat event with the web response (JSON) to the result..
    p.messageAll(msg) // We allow the player to send the filtered message...
   
    }); // End of .then handling
    
}) // End of event
