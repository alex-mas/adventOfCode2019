
const fuelRequiredByModule = (mass)=>{
    return Math.max(Math.trunc(mass/3)-2,0);
}


const modules = require('./data.json');
const answer = modules.reduce((sum,mass)=>{
    return sum + fuelRequiredByModule(mass);
},0);
console.log(answer);