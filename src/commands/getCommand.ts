import {BcsClient} from "../bcsClient";

const {prompt} = require('enquirer');

const validateDateInput = (input: string): boolean => /\d{1,2}.\d{1,2}.\d{4}/i.test(input);
const dateFromString = (value: string): Date => new Date(value.split(".").reverse().join("-"));

export const handleGetCommand = async () => {

    await prompt([
        {
            type: 'input',
            name: 'dateString',
            message: 'For which date do you want to get your time recordings?',
            initial: new Date().toLocaleDateString(),
            validate: validateDateInput,
        }
    ]).then(async ({dateString}) => {

        const date = dateFromString(dateString)

        const bcsClient = new BcsClient();
        const tasks = await bcsClient.fetch(date);

        if (tasks.length > 0) {
            console.table(tasks.map(task => ({
                'ticket': task.ticket,
                'description': task.description,
                'time': task.time.toString(),
                'projectId': task.projectId
            })));
        } else {
            console.log("No time recordings for this date!");
        }
    });
}
