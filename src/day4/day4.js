

const addToMap = (map,key,value)=>{
    const current = map.get(key);
    map.set(key, (current ? current : 0)+value);
}


const start = Date.now();
const doesSatisfyRule = (number, constraints) => {
    numberString = number.toString();
    if(numberString.length !== 6){
        return false;
    }
    let last = numberString[0];
    let duplicates = new Map();
    for (let i = 1; i < numberString.length; i++) {

        const current = numberString[i];
        if (numberString[i] < last) {
            return false;
        }
        if (numberString[i] === last) {
            addToMap(duplicates,numberString[i],1);
        }
        last = numberString[i];
    }
    for(let value of duplicates.values()){
        if(value === 1){
            return true;
        }
    }
    return false;
}
let startingNumber = 382345;
let maxNumber = 843167;
let valid = [];
for (let i = startingNumber; i <= maxNumber; i++) {
    if(number.toString())
    if (doesSatisfyRule(i)) {
        valid.push(i);
    }
}

const time = Date.now()-start;
console.log('It took '+ time/1000 + ' seconds to run');

console.log(doesSatisfyRule(112233));
console.log(doesSatisfyRule(123444));
console.log(doesSatisfyRule(111122));
console.log(valid, valid.length);