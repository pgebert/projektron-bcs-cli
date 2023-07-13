import {handleAddCommand} from "./addCommand";


export const handleCommand = async (command: string) => {


    switch (command) {
        case 'add':
            await handleAddCommand();
            break;
        default:
            console.log("Not implemented yet.");
            break;
    }
}
