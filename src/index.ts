#!/usr/bin/env node

import {config as dotenvConfig} from 'dotenv';
import {handleCommand} from "./commands/commandHandler";
import {BcsClient, ForbiddenError, PageNotFoundError} from "./bcsClient";
import {setEnvValue} from "./utils/envUtils";
import * as path from "path";

const colors = require('ansi-colors');
const {prompt} = require('enquirer');

dotenvConfig({path: path.resolve(__dirname, '../.env')});


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
//     const bcsClient = await BcsClient.getInstance();
//     bcsClient.connect('', '', '');
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

    let baseUrl = process.env.BCS_URL || 'https://bcs.de'
    let username = process.env.BCS_USERNAME || ''
    let password = process.env.BCS_PASSWORD || ''
    
    const bcsClient = await BcsClient.getInstance();

    while (!bcsClient.isConnected) {
        try {
            await bcsClient.connect(baseUrl, username, password);
            console.log("Successfully logged in 🎉");

            // save credentials for future visits
            setEnvValue('BCS_URL', baseUrl);
            setEnvValue('BCS_USERNAME', username);
            setEnvValue('BCS_PASSWORD', password);
        } catch (e) {

            if (e instanceof PageNotFoundError) {

                console.log("Unable to reach the BCS instance - make sure you have access and the base URL is correct.");

                ({baseUrl} = await prompt([
                    {
                        type: 'input',
                        name: 'baseUrl',
                        message: 'Please provide the base URL of your BCS instance:',
                        initial: baseUrl,
                    }
                ]));

            } else if (e instanceof ForbiddenError) {

                console.log("Unable to login to BCS instance - please provide your credentials.");

                ({username, password} = await prompt([
                    {
                        type: 'input',
                        name: 'username',
                        message: 'Please provide your username:',
                    },
                    {
                        type: 'password',
                        name: 'password',
                        message: 'Please provide your password:',
                    },
                ]));
            } else {
                console.log(e);
            }
        }
    }


    await prompt({
        type: 'select',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['add', 'get', 'check', 'reset', 'mapping', 'quit']
    }).then(({command}) => {

        handleCommand(command).then(() => main())

    })

};

main().catch(console.error);
