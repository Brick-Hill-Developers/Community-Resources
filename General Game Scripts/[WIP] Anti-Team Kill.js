let tool = new Tool("GUNTEST")
tool.model = 6929
score = 0

tool.on("activated", (p) => {
 attacker = p 
// someevent like touching brick or smrtlion's sword script
if(p.team !== attacker.team){
//p.setHealth(p.health-5);

p.kill();
}
