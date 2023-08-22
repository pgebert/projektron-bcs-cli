import {BcsClient} from "../bcsClient";
import {TimeoutError} from "puppeteer";

const {prompt} = require('enquirer');

const validateDateInput = (input: string): boolean => /\d{1,2}.\d{1,2}.\d{4}/i.test(input);
const dateFromString = (value: string): Date => new Date(value.split(".").reverse().join("-"));

export const handleResetCommand = async () => {

    await prompt([
        {
            type: 'input',
            name: 'dateString',
            message: 'For which date do you want to reset your time recordings?',
            initial: new Date().toLocaleDateString(),
            validate: validateDateInput,
        },
        {
            type: 'confirm',
            name: 'confirmed',
            message: 'Are you sure?',
            initial: 'Y',
        }
    ]).then(async ({dateString, confirmed}) => {

        const date = dateFromString(dateString)

        if (confirmed) {
            const bcsClient = await BcsClient.getInstance();
            await bcsClient.reset(date);
            console.log("Finished reset of all time recordings for this date!");
        }
    }).catch(e => {
        console.log("Oh snap - something went wrong! 😕");

        if (e instanceof TimeoutError) {
            console.log("Received timeout error!");
        }
    });
}
