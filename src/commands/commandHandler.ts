import {handleAddCommand} from "./addCommand";
import {handleGetCommand} from "./getCommand";
import {handleResetCommand} from "./resetCommand";

import {exit} from 'process'
import {BcsClient} from "../bcsClient";
import {handleCheckCommand} from "./checkCommand";
import {handleMappingCommand} from "./mappingCommand";


export const handleCommand = async (command: string) => {

    switch (command) {
        case 'add':
            await handleAddCommand()
                .catch(console.error);
            break;
        case 'get':
            await handleGetCommand()
                .catch(console.error);
            break;
        case 'reset':
            await handleResetCommand()
                .catch(console.error);
            break;
        case 'check':
            await handleCheckCommand()
                .catch(console.error);
            break;
        case 'mapping':
            await handleMappingCommand()
                .catch(console.error);
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
