import {BcsClient} from "../bcsClient";
import {TimeoutError} from "puppeteer";

export const handleCheckCommand = async () => {

    const bcsClient = await BcsClient.getInstance();
    await bcsClient.check().then((result) => {
        console.log(`Your time balance for the current month is ${result}`)
    }).catch(e => {
        console.log("Oh snap - something went wrong! 😕");

        if (e instanceof TimeoutError) {
            console.log("Received timeout error!");
        }
    });
}
