const input = require('./data.json');
const getCollision = (v1, v2, v3, v4) => {
    // calculate the distance to intersection point
    const uA = ((v4.x - v3.x) * (v1.y - v3.y) - (v4.y - v3.y) * (v1.x - v3.x)) / ((v4.y - v3.y) * (v2.x - v1.x) - (v4.x - v3.x) * (v2.y - v1.y));
    const uB = ((v2.x - v1.x) * (v1.y - v3.y) - (v2.y - v1.y) * (v1.x - v3.x)) / ((v4.y - v3.y) * (v2.x - v1.x) - (v4.x - v3.x) * (v2.y - v1.y));
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return {
            x: v1.x + (uA * (v2.x-v1.x)),
            y: v1.y + (uA * (v2.y-v1.y))
        }
    } else {
        return false;
    }
}

//for each wire, 
//for each pair of points
//for each other wire
//for each pair of points
//check if there is a collision
//if there is store the collision
//compute the manhattan distance between origin and collisions
//get the lesser element of the last computation

const processedInput = [];

for (let wire of input) {
    const processedPath = [{ x: 0, y: 0 }];
    for (let i = 0; i < wire.length; i++) {
        const position = processedPath[i];
        let movement = wire[i];
        const direction = movement[0];
        const magnitude = Number(movement.substr(1));
        if (direction === 'U') {
            processedPath.push({
                x: position.x,
                y: position.y + magnitude
            });
        }
        if (direction === 'D') {
            processedPath.push({
                x: position.x,
                y: position.y - magnitude
            });
        }
        if (direction === 'R') {
            processedPath.push({
                x: position.x + magnitude,
                y: position.y
            });
        }
        if (direction === 'L') {
            processedPath.push({
                x: position.x - magnitude,
                y: position.y
            });
        }
    }
    processedInput.push(processedPath);
}

const collisions = [];
for (let wire of processedInput) {
    for (let i = 0; i < wire.length-1; i++) {
        const a = wire[i];
        const b = wire[i+1];
        for (let wire2 of processedInput) {
            if(wire2 === wire){
                break;
            }
            for (let j = 0; j < wire2.length-1; j++) {
                const c = wire2[j];
                const d = wire2[j+1];
                const collision = getCollision(a,b,c,d);
                if(collision){
                    collisions.push(collision);
                }
            }
        }
    }
}
const result = Math.min(...collisions.map((collision)=>Math.abs(collision.x) + Math.abs(collision.y)));
console.log(collisions.length, result);