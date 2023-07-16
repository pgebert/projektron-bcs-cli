import {handleAddCommand} from "./addCommand";
import {handleGetCommand} from "./getCommand";


export const handleCommand = async (command: string) => {


    switch (command) {
        // case 'login':
        //     await handleLoginCommand();
        //     break;
        case 'add':
            await handleAddCommand();
            break;
        case 'get':
            await handleGetCommand();
            break;
        default:
            console.log("Not implemented yet.");
            break;
    }
}
