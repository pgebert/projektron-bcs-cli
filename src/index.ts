#!/usr/bin/env node

import {config as dotenvConfig} from 'dotenv';
import {handleCommand} from "./commands/commandHandler";

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
//     const today = new Date();
//
//     await bcsClient.add(today, tasks).catch(console.error);
//     await bcsClient.fetch(today).then(tasks => console.log(tasks));
//     // await bcsClient.reset().catch(console.error);
// })()


// console.log(colors.red('✔ This is a red string!'));
// console.log(colors.danger.strong.em('Error!'));
// console.log(colors.warning('Heads up!'));
// console.log(colors.info('Did you know...'));
// console.log(colors.success.bold('It worked!'));


const main = async () => {


    await prompt({
        type: 'select',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['login', 'add', 'get', 'reset', 'check', 'quit']
    }).then(({command}) => {

        handleCommand(command).then(() => main())

    })

};

main().catch(console.error);
