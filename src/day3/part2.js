const input = require('./data.json');

const getManhattanDistance =(a,b)=>{
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}
//adapted from https://github.com/processing/processing/wiki/Line-Collision-Detection
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

const start = Date.now();
const processedInput = [];
const steps = [];

for (let wire of input) {
    const processedPath = [{ x: 0, y: 0 }];
    const processedSteps = [];
    for (let i = 0; i < wire.length; i++) {
        const position = processedPath[i];
        let movement = wire[i];
        const direction = movement[0];
        const magnitude = Number(movement.substr(1));
        processedSteps.push(magnitude);
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
    steps.push(processedSteps);
}

const collisions = [];
const collisionSteps = [];
const wire1 = processedInput[0];
const wire2 = processedInput[1];
for (let i = 0; i < wire1.length-1; i++) {
    const a = wire1[i];
    const b = wire1[i+1];
    for (let j = 0; j < wire2.length-1; j++) {
        const c = wire2[j];
        const d = wire2[j+1];
        const collision = getCollision(a,b,c,d);
        if(collision && (collision.x !== 0 || collision.y !== 0)){
            const distanceToCollision = getManhattanDistance(collision,a) + getManhattanDistance(collision,c);
            let sumOfSteps = 0;
            const wire1Steps = steps[0].reduce((p,c,index)=>{
                if(index < i){
                    return p+c;
                }else{
                    return p;
                }
            },0);
            const wire2Steps = steps[1].reduce((p,c,index)=>{
                if(index < j){
                    return p+c;
                }else{
                    return p;
                }
            },0);
            sumOfSteps = wire1Steps + wire2Steps + distanceToCollision;
            collisionSteps.push(sumOfSteps);
            collisions.push(collision);
        }
    }
}

const result = Math.min(...collisions.map((collision)=>Math.abs(collision.x) + Math.abs(collision.y)));
const result2 = Math.min(...collisionSteps);
const end = Date.now()-start;

console.log('result took '+ end/1000+' seconds to compute');

console.log(collisions.length, result, collisionSteps, result2);