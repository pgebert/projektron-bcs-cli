import {handleAddCommand} from "./addCommand";
import {handleGetCommand} from "./getCommand";
import {handleResetCommand} from "./resetCommand";
import {handleLoginCommand} from "./loginCommand";

import {exit} from 'process'


export const handleCommand = async (command: string) => {


    switch (command) {
        case 'login':
            await handleLoginCommand();
            break;
        case 'add':
            await handleAddCommand();
            break;
        case 'get':
            await handleGetCommand();
            break;
        case 'reset':
            await handleResetCommand();
            break;
        case 'quit':
            console.log('Goodbye!')
            exit(0);
        default:
            console.log("Not implemented yet.");
            break;
    }
}
