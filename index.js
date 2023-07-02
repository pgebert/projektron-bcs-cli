#!/usr/bin/env node

import puppeteer from 'puppeteer';


class Task {
    constructor(ticket, description, time) {
        this.ticket = ticket;
        this.description = description;
        this.hours = this.getHours(time)
        this.minutes = this.getMinutes(time)
        this.projectId = this.getProjectId()
    }

    getProjectId = (task) => {
        if (new RegExp("daily", "i").test(this.description)) {
            return "1678898995032"
        } else if (new RegExp("orgsese-", "i").test(this.ticket)) {
            return "1678898695172"
        } else if (new RegExp("oramy-", "i").test(this.ticket)) {
            return "1678898995032"
        } else if (new RegExp("sm-", "i").test(this.ticket)) {
            return "1686218840677"
        }

        // TODO Estimate default category
        return null
    }

    getHours = (time) => {
        const hours = time.split(":")[0];
        return hours ? hours : 0;
    }

    getMinutes = (time) => {
        const minutes = time.split(":")[1];
        return minutes ? minutes : 0;
    }
}

// TODO build tasks from args
const tasks = [
    new Task('', 'Daily', '0:15'),
    new Task('ORAMY-98', 'ORAMY Test', '1:15'),
    new Task('ORGSESE-104', 'ORGSESE Test', '1:15'),
    new Task('SM-102', 'SM Test', '1:15'),
];


const quit = (browser) => {

    process.exit(1);
}

(async () => {

    const baseUrl = process.env.BCS_URL
    const username = process.env.BCS_USERNAME
    const password = process.env.BCS_PASSWORD

    // TODO set to 'new' to run in background
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    console.log(`Going to ${baseUrl}/bcs/login`)

    await page.goto(`${baseUrl}/bcs/login`).catch(error => {
        console.log(`❌ Not able to reach ${baseUrl} - is bcs_url correct and accessible?`)
        browser.close()
        quit()
    });

    const userInput = await page.waitForSelector('#label_user')
    await userInput.type(username)

    const pwdInput = await page.waitForSelector('#label_pwd')
    await pwdInput.type(password)

    const loginButton = await page.waitForSelector('#loginbutton')
    await loginButton.click()

    console.log(`Going to ${baseUrl}/bcs/mybcs/dayeffortrecording`)
    const notificationDialogButton = await page.waitForSelector('input.notificationPermissionLater')
    await notificationDialogButton.click()

    // TODO type total time
    // TODO set default projectID

    for (const task of tasks) {

        console.log("Try to insert ", task.description, task.projectId)

        if (task.projectId) {
            await page.evaluate((task) => {

                console.log("Inserting ", task.description)

                const rowsForProjectId = document.querySelectorAll(`tr[data-listtaskgroupoid="${task.projectId}_JTask"]`)
                const lastRowForProjectId = rowsForProjectId[rowsForProjectId.length - 1]

                const hourInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(1)`);
                hourInput.value = task.hours;

                const minuteInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(3)`);
                minuteInput.value = task.minutes;

                const descriptionInput = lastRowForProjectId.querySelector(`td[name="description"] > textarea`);
                descriptionInput.value = task.description;

            }, task);

            // TODO only if contains tasks with same projectId afterwards
            const plusButton = await page.waitForSelector(`tr[data-listtaskgroupoid="${task.projectId}_JTask"] > td[name="[plusminus]"] > button`)
            await plusButton.click()

        }
    }

    // await browser.close();
})();
