

let tool = new Tool("GUNTEST")
tool.model = 6929
score = 0

tool.on("activated", (p) => {
  //console.log(p.username + " has clicked with the tool equipped!")
let brick = new Brick(new Vector3(0,0,0), new Vector3(0.5, 2.5, 0.5), "#f54242")
brick.visibility = 0.5
  
brick.setPosition(new Vector3(p.position.x,p.position.y-5,p.position.z));
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-10,p.position.z)); brick.setRotation(p.cameraRotation);}, 100);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-15,p.position.z)); brick.setRotation(p.cameraRotation);}, 200);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-20,p.position.z)); brick.setRotation(p.cameraRotation);}, 300);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-25,p.position.z)); brick.setRotation(p.cameraRotation);}, 400);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-30,p.position.z)); brick.setRotation(p.cameraRotation);}, 500);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-35,p.position.z)); brick.setRotation(p.cameraRotation);}, 600);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-40,p.position.z)); brick.setRotation(p.cameraRotation);}, 700);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-45,p.position.z)); brick.setRotation(p.cameraRotation);}, 800);
setTimeout(() => {brick.setPosition(new Vector3(p.position.x,p.position.y-50,p.position.z)); brick.setRotation(p.cameraRotation);}, 900);
setTimeout(() => {brick.destroy();}, 1000);
Game.newBrick(brick);
brick.touching(debounce((p) => {

p.kill();
}), 500) // We add a debounce of half a second to prevent double hits.


})




Game.on("playerJoin", (p) => {
p.message("This game currently in testing phase gun is not %100 finished and it may not like this when it released");
p.equipTool(tool)
 
})

