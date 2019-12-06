const fs = require('fs');
const rawData = fs.readFileSync('./src/day6/data.csv');
const orbitData = rawData.toString().split('\r\n');

const getOrbitsOfNodeAndChildren = (node, map,depth)=>{
    const children = orbitMap.get(node);
    const baseOrbits = children.length*depth;
    const indirectOrbits = children.map((child)=>getOrbitsOfNodeAndChildren(child,map,depth+1)).reduce((a,b)=>a+b,0);
    return baseOrbits+indirectOrbits;
}
const doesNodePathContainTarget = (node,target,map)=>{
    if(node === target){
        return true;
    }
    const children = map.get(node);
    if(node !== target && children.length === 0){
        return false;
    }
    return children.some((child)=>doesNodePathContainTarget(child,target,map));
}
const getDirectOrbitCostToNestedChildren = (node,target,map)=>{
    const children = map.get(node);
    if(children.includes(target)){
        return 1;
    }else{
        let childRoot = children.find((child)=>doesNodePathContainTarget(child,target,map));
        return 1 + getDirectOrbitCostToNestedChildren(childRoot,target,map);
    }
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

let root = undefined
for(let object of orbitMap.keys()){
    const toYou = doesNodePathContainTarget(object, 'YOU',orbitMap);
    const toSan = doesNodePathContainTarget(object, 'SAN',orbitMap);
    if(toSan && toYou){
        const newRoot = {
            root: object,
            length: getDirectOrbitCostToNestedChildren(object,'YOU',orbitMap) + getDirectOrbitCostToNestedChildren(object, 'SAN', orbitMap) -2
        };
        if(!root){
            root = {
                root: object,
                length: getDirectOrbitCostToNestedChildren(object,'YOU',orbitMap) + getDirectOrbitCostToNestedChildren(object, 'SAN', orbitMap) -2
            };
        }else if(root.length >= newRoot){
            root = newRoot;
        }
    
    }

}


console.log('The algorithm took ', (Date.now()-start)/1000 + ' seconds to complete');
console.log(root)
