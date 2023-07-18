import {BcsClient} from "../bcsClient";

const {prompt} = require('enquirer');

const validateDateInput = (input: string): boolean => /\d{1,2}.\d{1,2}.\d{4}/i.test(input);
const dateFromString = (value: string): Date => new Date(value.split(".").reverse().join("-"));

export const handleCheckCommand = async () => {

    const bcsClient = await BcsClient.getInstance();
    await bcsClient.check().then((result) => {
        console.log(`Your time balance for the current month is ${result}`)
    });
}
