const EventEmitter = require('events');
const perm = require('array-permutation');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const instructions = require('./testData.json');




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
    const orderedModes = modes.reverse().map(mode => parseInt(mode));
    if (modes.length < params.length) {
        const defaultModes = [];
        while (defaultModes.length + orderedModes.length < params.length) {
            defaultModes.push(0);
        }
        return [...orderedModes, ...defaultModes];
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

const processValues = (parameters, program, modes) => parameters.map((parameter, i) => getValueOfParam(program, modes[i], parameter));

const defaultInstruction = (instructionLogic, parameterAmount) => {
    return async (modes, consume, program, goTo) => {
        const parameters = [];
        for (let i = 0; i < parameterAmount; i++) {
            parameters.push(consume());
        }
        modes = processModes(modes, parameters);
        //console.log('processed Modes', modes);
        const values = processValues(parameters, program, modes);
        return instructionLogic(parameters, values, program, goTo);
    }
}

const additionInstruction = defaultInstruction(async (parameters, values, program) => {
    values[2] = parameters[2];
    const x = values[0] + values[1];
    program[values[2]] = x;
}, 3);

const multiplicationInstruction = defaultInstruction(async (parameters, values, program) => {
    values[2] = parameters[2];
    const x = values[0] * values[1];
    program[values[2]] = x;
}, 3);


const inputInstruction = (modes, consume, program) => {
    return new Promise((resolve, reject) => {
        const a = consume();
        processedModes = processModes(modes, [a]);
        //console.log('stdin instruction', modes,processedModes, a);
        try {
            readline.question(`Please enter a numeric value as input\n`, (input) => {
                console.log(`The value entered was ${input}`);
                program[a] = parseInt(input);
                readline.close();
                resolve();
            });
        } catch (e) {
            console.log('rejected',e);
            reject();
         
        }
    })
}

const jupmIfTrueInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    //values[1] = parameters[1];
    if (values[0]) {
        goTo(values[1])
    }
    return;
}, 2);

const jupmIfFalseInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    //values[1] = parameters[1];
    if (!values[0]) {
        goTo(values[1])
    }
    return;
}, 2);

const lessThanInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    values[2] = parameters[2];
    if (values[0] < values[1]) {
        program[values[2]] = 1;
    } else {
        program[values[2]] = 0;
    }
    return;
}, 3);
const equalsInstruction = defaultInstruction(async (parameters, values, program, goTo) => {
    values[2] = parameters[2];
    if (values[0] === values[1]) {
        program[values[2]] = 1;
    } else {
        program[values[2]] = 0;
    }
    return;
}, 3);


const outputInstruction = defaultInstruction(async (parameters, values, program, consume) => {
    //console.log('stdout instruction', parameters,values);
    console.log('Program output: ', values[0]);
    return values[0];
}, 1);

const signalEmitter = new EventEmitter();

const interpreter = (handlers, opCodeExtractor) => async (program) => {
    let instructionPointer = 0;
    const goTo = (number) => {
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


const main = async () => {
    const start = Date.now();
    const permutations = perm.permutation([5,6,7,8,9]);
    let outputs = [];

    for (let inputs of permutations) {
        let currentOutput = 0;
        const programs = [];
        //initialization phase
        for (let i = 0; i < 5; i++) {
            programs.push([...instructions]);
            let count = 0;
            programInstructions[4] = async(...args)=>{
                currentOutput = await outputInstruction(...args);
                return currentOutput;
            };
            programInstructions[3] = (modes, consume, program) => {
                return new Promise((resolve, reject) => {
                    const a = consume();
                    processedModes = processModes(modes, [a]);
                    //console.log('stdin instruction', modes,processedModes, a);
                    try {
                        readline.question(`Please enter a numeric value as input\n`, (input) => {
                            console.log(`The value entered was ${input}`);
                            program[a] = parseInt(input);
                            readline.close();
                            resolve();
                        });
                        if(count === 0){
                            readline.write(`${inputs[i]}\n`);
                            count+=1;
                        }else{
                            readline.write(`${currentOutput}\n`);
                        }
                   
                    } catch (e) {
                        reject();
                        console.log(e);
                    }
                })
            }

            const output = interpreter(programInstructions, getModesAndOpcode)([...instructions]);

            await output;
        }
        outputs.push(currentOutput);

    }
    console.log(outputs.sort((a,b)=>b-a)[0]);
    console.log('Runtime: ', (Date.now() - start)/1000);
}

main();
