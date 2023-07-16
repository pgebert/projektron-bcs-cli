import {BcsClient} from "../bcsClient";

const {AuthPrompt} = require('enquirer');


export const handleLoginCommand = async () => {


    async function authenticate(value, state) {

        const bcsClient = new BcsClient()

        try {
            const today = new Date();
            await bcsClient.fetch(today);
            return true
        } catch (e) {
            console.log("Unable to authenticate - are your credentials correct?")
        }

        return false;

    }

    const CustomAuthPrompt = AuthPrompt.create(authenticate);

    const prompt = new CustomAuthPrompt({
        name: 'password',
        message: 'Please enter your credentials:',
        choices: [
            {name: 'username', message: 'username'},
            {name: 'password', message: 'password'}
        ]
    });

    await prompt
        .run()
        .then(answer => console.log('Authenticated?', answer))
        .catch(console.error);


}
