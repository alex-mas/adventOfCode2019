const fuelRequiredByModule = (mass)=>{
    let sum = fuelRequiredByModuleSimple(mass);
    let last = sum;
    while(last > 0 ){
       last =  fuelRequiredByModuleSimple(last);
       sum += last;
    }
    return sum;
}
const modules = require('./data.json');
const answer =  modules.reduce((sum,mass)=>{
    return sum + fuelRequiredByModule(mass);
},0);
console.log(answer);