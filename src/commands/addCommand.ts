import {Task} from "../task";
import {Time} from "../time";
import {BcsClient} from "../bcsClient";

const {prompt} = require('enquirer');


const validateInput = (input: string): boolean => /\d{1,2}:\d{1,2}/i.test(input);

export const handleAddCommand = async () => {

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
                message: 'Please provide the following information to add a task:',
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
