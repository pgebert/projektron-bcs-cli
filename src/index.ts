#!/usr/bin/env node

import {config as dotenvConfig} from 'dotenv';
import {Task} from './task';

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
//     new Task('', 'Daily', '0:15'),
//     new Task('ORAMY-98', 'ORAMY Test', '1:15'),
//     new Task('ORGSESE-104', 'ORGSESE Test', '1:15'),
//     new Task('SM-102', 'SM Test', '1:15'),
// ];
//
//
// const bcsClient = new BcsClient()
// bcsClient.add(tasks).catch(console.error);


// console.log(colors.red('✔ This is a red string!'));
// console.log(colors.danger.strong.em('Error!'));
// console.log(colors.warning('Heads up!'));
// console.log(colors.info('Did you know...'));
// console.log(colors.success.bold('It worked!'));


const validateInput = (input: string): boolean => /\d{1,2}:\d{1,2}/i.test(input);

const handleAddCommand = async () => {

    console.log("Handle add command")
    const tasks: Task[] = [];

    await prompt([
        {
            type: 'input',
            name: 'total',
            message: 'How many hours did you work today in total?',
            initial: '8:00',
            validate: validateInput
        }
    ]).then(console.log);

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
                    {name: 'more', message: 'Do want to add another task?', initial: 'true'}
                ],
                validate: ({time}) => {
                    console.log("Called validation with ", time);
                    return validateInput(time);
                }
            }
        ]).then(({input}) => {

            const task = new Task(input)
            tasks.push(task);
            console.log(`Added ${task}`);

            moreTasks = input.more === "true";
        });
    }
}


const main = async () => {


    await prompt({
        type: 'select',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['login', 'add', 'get', 'check']
    }).then((response) => {
        console.log('Answer:', response)

        switch (response.command) {
            case 'add':
                handleAddCommand();
                break;
            default:
                console.log("Not implemented yet.");
                break;
        }
    }).catch(console.error);


};

main().catch(console.error);
