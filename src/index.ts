#!/usr/bin/env node

import {config as dotenvConfig} from 'dotenv';
import {Task} from './task';
import {Time} from "./time";
import {BcsClient} from "./bcsClient";

const colors = require('ansi-colors');
const {prompt} = require('enquirer');
dotenvConfig();


colors.theme({
    danger: colors.red,
    dark: colors.dim.gray,
    disabled: colors.gray,
    em: colors.italic,
    heading: colors.bold.underline,
    info: colors.cyan,
    muted: colors.dim,
    primary: colors.blue,
    strong: colors.bold,
    success: colors.green,
    underline: colors.underline,
    warning: colors.yellow
});


// const tasks = [
//     new Task({ticket: '', description: 'Daily', time: '0:15'}),
//     new Task({ticket: 'ORAMY-98', description: 'ORAMY Test', time: '1:15'}),
//     new Task({ticket: 'ORGSESE-104', description: 'ORGSESE Test', time: '1:15'}),
//     new Task({ticket: 'SM-102', description: 'SM Test', time: '1:15'}),
// ];
//
//
// (async () => {
//     const bcsClient = new BcsClient()
//
//     await bcsClient.add(tasks).catch(console.error);
//     await bcsClient.fetch().then(tasks => console.log(tasks));
//     // await bcsClient.reset().catch(console.error);
// })()


// console.log(colors.red('✔ This is a red string!'));
// console.log(colors.danger.strong.em('Error!'));
// console.log(colors.warning('Heads up!'));
// console.log(colors.info('Did you know...'));
// console.log(colors.success.bold('It worked!'));


const validateInput = (input: string): boolean => /\d{1,2}:\d{1,2}/i.test(input);

const handleAddCommand = async () => {

    console.log("Handle add command")
    const tasks: Task[] = [];
    let targetTime = new Time(0);

    await prompt([
        {
            type: 'input',
            name: 'total',
            message: 'How many hours did you work today in total?',
            initial: '8:00',
            validate: validateInput
        }
    ]).then((input) => {
        targetTime = Time.fromString(input.total);
    });

    let moreTasks = true;

    while (moreTasks) {
        await prompt([
            {
                type: 'form',
                name: 'input',
                message: 'Please provide the following information:',
                choices: [
                    {name: 'description', message: 'What did you work?', initial: 'Coded some cool stuff'},
                    {name: 'ticket', message: 'Has it a ticket number?', initial: ''},
                    {name: 'time', message: 'How long did it take you?', initial: '0:15'},
                    // {name: 'more', message: 'Do want to add another task?', initial: 'true'}
                ],
                validate: ({time}) => {
                    console.log("Called validation with ", time);
                    return validateInput(time);
                }
            },
        ]).then(({input}) => {
            tasks.push(new Task(input));
            const recordedTime = tasks.map((task) => task.time).reduce((a, b) => a.plus(b), new Time(0));
            const missingTime = targetTime.minus(recordedTime);

            if (missingTime.minutes <= 0) {
                console.log(`You reached your goal 🎉`);
            } else {
                console.log(`Added ${recordedTime} in total - ${missingTime} still missing.`);
            }
        });

        await prompt([
            {
                type: 'confirm',
                name: 'more',
                message: 'Do want to add another task?',
                initial: 'Y',
            }
        ]).then(({more}) => {
            moreTasks = more;
        });
    }

    await prompt([
        {
            type: 'confirm',
            name: 'save',
            message: 'Do want to save your tasks to BCS?',
            initial: 'Y',
        }
    ]).then(async ({save}) => {
        if (save) {
            //TODO may reset before
            const bcsClient = new BcsClient()
            await bcsClient.reset()
            await bcsClient.add(tasks).then(() => console.log("Saved new tasks"))
        }
    });
}


const main = async () => {


    await prompt({
        type: 'select',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['login', 'add', 'get', 'reset', 'check', 'quit']
    }).then((response) => {
        console.log('Answer:', response)

        switch (response.command) {
            case 'add':
                handleAddCommand().then(() => main());
                break;
            default:
                console.log("Not implemented yet.");
                break;
        }
    }).catch(console.error);


};

main().catch(console.error);
