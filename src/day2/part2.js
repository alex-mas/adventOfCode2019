const instructions = require('./data.json');

const interpreter = (program) => {
    let instructionPointer = 0;
    const consume = () => {
        const ret = program[instructionPointer];
        instructionPointer = instructionPointer + 1;
        return ret;
    }
    let current = -1;
    while (current !== 99) {
        current = consume();
        //console.log(current);
        switch (current) {
            case 1: {
                const a = program[consume()];
                const b = program[consume()];
                const c = consume();
                const x = a + b;
                program[c] = x;
                break;
            }
            case 2: {
                const a = program[consume()];
                const b = program[consume()];
                const c = consume();
                const x = a * b;
                program[c] = x;
                break;
            }
        }
    }
    return program[0];
}




for (let verb = 0; verb <= 99; verb++) {
    for (let noun = 0;noun <= 99; noun++) {
        const input = [...instructions];
        input[1] = noun;
        input[2] = verb;
        const output = interpreter(input);
        if (output === 19690720) {
            console.log(output, verb, noun, 100 * noun + verb);
            break;
        }
    }
}
