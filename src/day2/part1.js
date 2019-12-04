const instructions = require('./data.json');

const interpreter = (program)=>{
    let index = 0;
    const consume = ()=>{
        const ret = program[index];
        index = index + 1;
        return ret;
    }
    let current = -1;
    while(current !== 99){
        current = consume();
        console.log(current);
        switch(current){
            case 1:{
                const a = program[consume()];
                const b = program[consume()];
                const c = consume();
                const x = a+b;
                program[c] = x;
                console.log(index,current,JSON.stringify(program), a,b,c,x);
                break;
            }
            case 2:{
                const a = program[consume()];
                const b = program[consume()];
                const c = consume();
                const x = a*b;
                program[c] = x;
                console.log(index,current,JSON.stringify(program), a,b,c,x);
                break;
            }
        }
    }
}

instructions[1] = 12;
instructions[2] = 2;
interpreter(instructions);
console.log(instructions[0]);
