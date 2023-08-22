import {Task} from "../task";
import {Time} from "../time";
import {BcsClient} from "../bcsClient";
import {TimeoutError} from "puppeteer";

const {prompt} = require('enquirer');


const validateTimeInput = (input: string): boolean => /\d{1,2}:\d{1,2}/i.test(input);
const validateDateInput = (input: string): boolean => /\d{1,2}.\d{1,2}.\d{4}/i.test(input);

const dateFromString = (value: string): Date => new Date(value.split(".").reverse().join("-"));

export const handleAddCommand = async () => {

    const tasks: Task[] = [];
    let targetDate = new Date();
    let targetTime = new Time(0);

    await prompt([
        {
            type: 'input',
            name: 'dateString',
            message: 'For which date do you want to add new time recordings?',
            initial: new Date().toLocaleDateString(),
            validate: validateDateInput,
        },
        {
            type: 'input',
            name: 'timeString',
            message: 'How many hours did you work today in total?',
            initial: '8:00',
            validate: validateTimeInput
        }
    ]).then(({dateString, timeString}) => {
        targetDate = dateFromString(dateString);
        targetTime = Time.fromString(timeString);
    });

    let moreTasks = true;

    while (moreTasks) {
        await prompt([
            {
                type: 'form',
                name: 'input',
                message: 'Please provide the following information to add a task:',
                choices: [
                    {name: 'description', message: 'What did you work?', initial: 'Coded some cool stuff'},
                    {name: 'ticket', message: 'Has it a ticket number?', initial: ''},
                    {name: 'time', message: 'How long did it take you?', initial: '0:15'},
                    // {name: 'more', message: 'Do want to add another task?', initial: 'true'}
                ],
                validate: ({time}) => {
                    return validateTimeInput(time);
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

            const bcsClient = await BcsClient.getInstance()
            //TODO may reset before or make add more robust
            await bcsClient.reset(targetDate)
            await bcsClient.add(targetDate, tasks).then(() => console.log("Saved new tasks"))
        }
    }).catch(e => {
        console.log("Oh snap - something went wrong! 😕");

        if (e instanceof TimeoutError) {
            console.log("Received timeout error!");
        }
    });
}
