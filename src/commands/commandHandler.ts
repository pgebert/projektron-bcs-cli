import {handleAddCommand} from "./addCommand";
import {handleGetCommand} from "./getCommand";
import {handleResetCommand} from "./resetCommand";

import {exit} from 'process'
import {BcsClient} from "../bcsClient";
import {handleCheckCommand} from "./checkCommand";


export const handleCommand = async (command: string) => {


    switch (command) {
        case 'add':
            await handleAddCommand();
            break;
        case 'get':
            await handleGetCommand();
            break;
        case 'reset':
            await handleResetCommand();
            break;
        case 'check':
            await handleCheckCommand();
            break;
        case 'quit':
            BcsClient.getInstance().then((client) => client.close());
            console.log('Goodbye!')
            exit(0);
        default:
            console.log("Not implemented yet.");
            break;
    }
}
