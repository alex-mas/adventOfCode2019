const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const instructions = require('./data.json');
const RUN_MODES = {
    DAY_2: 'DAY_2',
    DAY_5: 'DAY_5'
}

const RUN_MODE = RUN_MODES.DAY_5;

/**
 * Returns an array with mode[] and opcode
 */
const getModesAndOpcode = (instruction) => {
    const instr = instruction.toString();
    return [instr.substr(0, instr.length - 2).split(""), parseInt(instr.substr(instr.length - 2))];
}
const simpleGetOpcode = (instruction) => {
    return [[], `0${instruction}`];
}

const processModes = (modes, params) => {
    const orderedModes = modes.reverse().map(mode =>parseInt(mode));
    if (modes.length < params.length) {
        const defaultModes = [];
        while (defaultModes.length + orderedModes.length < params.length) {
            defaultModes.push(0);
        }
        return [...orderedModes,...defaultModes];
    }
    return orderedModes;
}

const getValueOfParam = (program, mode, param) => {
    if (mode === 0) {
        return program[param];
    } else {
        return param;
    }
}

const processValues = (parameters, program, modes)=> parameters.map((parameter, i) => getValueOfParam(program, modes[i], parameter));

const defaultInstruction = (instructionLogic,parameterAmount) => {
    return async (modes, consume, program, goTo) => {
        const parameters = [];
        for(let i = 0; i < parameterAmount; i++){
            parameters.push(consume());
        }
        modes = processModes(modes, parameters);
        //console.log('processed Modes', modes);
        const values = processValues(parameters,program,modes);
        return instructionLogic(parameters, values, program, goTo);
    }
}

const additionInstruction = defaultInstruction(async (parameters, values, program) => {
    console.log('addition instruction', parameters, values);
    values[2] = parameters[2];
    const x = values[0] + values[1];
    console.log('addition instruction', parameters, values, x);
    program[values[2]] = x;
},3);

const multiplicationInstruction = defaultInstruction(async (parameters, values, program) => {
    console.log('multiply instruction', parameters, values);
    values[2] = parameters[2];
    const x = values[0] * values[1];
    console.log('addition instruction mutated info', parameters, values,x);
    program[values[2]] = x;
},3);


const inputInstruction = async (modes, consume, program) => {
    return new Promise((resolve, reject) => {
        const a = consume();
        processedModes = processModes(modes, [a]);
        //console.log('stdin instruction', modes,processedModes, a);
        readline.question(`Please enter a numeric value as input\n`, (input) => {
            console.log(`The value entered was ${input}`);
            program[a] = parseInt(input);
            readline.close();
            resolve();
        });
    })
}

const jupmIfTrueInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    //values[1] = parameters[1];
    if(values[0]){
        goTo(values[1])
    }
    return;
}, 2);

const jupmIfFalseInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    //values[1] = parameters[1];
    if(!values[0]){
        goTo(values[1])
    }
    return;
}, 2);

const lessThanInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    values[2] = parameters[2];
    if(values[0] < values[1]){
        program[values[2]] = 1;
    }else{
        program[values[2]] = 0;
    }
    return;
}, 3);
const equalsInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    values[2] = parameters[2];
    if(values[0] === values[1]){
        program[values[2]] = 1;
    }else{
        program[values[2]] = 0;
    }
    return;
}, 3);


const outputInstruction = defaultInstruction(async (parameters, values, program, consume) => {
    //console.log('stdout instruction', parameters,values);
    console.log('Program output: ', values[0]);
    return;
}, 1);




const interpreter = (handlers, opCodeExtractor) => async (program) => {
    let instructionPointer = 0;
    const goTo = (number)=>{
        instructionPointer = number;
    }
    const consume = () => {
        const ret = program[instructionPointer];
        instructionPointer = instructionPointer + 1;
        return ret;
    }
    let current = -1;
    while (current !== 99) {
        current = consume();
        const [modes, opCode] = opCodeExtractor(current);
        //console.log('Modes and opcode',modes,opCode);
        if (handlers[opCode]) {
            try {
                await handlers[opCode](modes, consume, program, goTo);
            } catch (e) {
                console.warn('Exception running instruction', current, opCode, modes, program);
            }
        }
    }
    return program;
}

const programInstructions = {
    1: additionInstruction,
    2: multiplicationInstruction,
    3: inputInstruction,
    4: outputInstruction,
    5: jupmIfTrueInstruction,
    6: jupmIfFalseInstruction,
    7: lessThanInstruction,
    8: equalsInstruction
}


console.log('Running program wiht mode ' + RUN_MODE);
const start = Date.now();
if (RUN_MODE === RUN_MODES.DAY_2) {
    /**
     * Day 2
     */
    for (let verb = 0; verb <= 99; verb++) {
        for (let noun = 0; noun <= 99; noun++) {
            const input = [...instructions];
            input[1] = noun;
            input[2] = verb;
            interpreter(programInstructions, simpleGetOpcode)(input).then((output) => {
                if (output === 19690720) {
                    console.log(output, verb, noun, 100 * noun + verb);
                    console.log(`Program took ${(Date.now() - start) / 1000} seconds to execute`);
                    process.exit();
                }
            });
        }
    }
}
if (RUN_MODE === RUN_MODES.DAY_5) {
    const input = [...instructions];
    interpreter(programInstructions, getModesAndOpcode)(input).then((value) => {
        console.log(`Program took ${(Date.now() - start) / 1000} seconds to execute`);
    });

}
