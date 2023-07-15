import {handleAddCommand} from "./addCommand";


export const handleCommand = async (command: string) => {


    switch (command) {
        // case 'login':
        //     await handleLoginCommand();
        //     break;
        case 'add':
            await handleAddCommand();
            break;
        default:
            console.log("Not implemented yet.");
            break;
    }
}
