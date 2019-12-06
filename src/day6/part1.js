const fs = require('fs');
const rawData = fs.readFileSync('./src/day6/data.csv');
const orbitData = rawData.toString().split('\r\n');

const getOrbitsOfNodeAndChildren = (node, map,depth)=>{
    const children = orbitMap.get(node);
    const baseOrbits = children.length*depth;
    const indirectOrbits = children.map((child)=>getOrbitsOfNodeAndChildren(child,map,depth+1)).reduce((a,b)=>a+b,0);
    return baseOrbits+indirectOrbits;
}

const start = Date.now();
const orbitMap = new Map();

orbitMap.set('COM', []);

for(let data of orbitData){
    const [obj,orbit] = data.split(')');
    if(!orbitMap.get(orbit)){
        orbitMap.set(orbit, []);
    }
    if(!orbitMap.get(obj)){
        orbitMap.set(obj, [orbit]);  
    }else{
        orbitMap.set(obj,[...orbitMap.get(obj),orbit]);
    }
}

const totalOrbits = getOrbitsOfNodeAndChildren('COM',orbitMap, 1);
console.log('The algorithm took ', (Date.now()-start)/1000 + ' seconds to complete');
console.log(totalOrbits);