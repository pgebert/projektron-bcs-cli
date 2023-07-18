import {BcsClient} from "../bcsClient";

export const handleCheckCommand = async () => {

    const bcsClient = await BcsClient.getInstance();
    await bcsClient.check().then((result) => {
        console.log(`Your time balance for the current month is ${result}`)
    });
}
