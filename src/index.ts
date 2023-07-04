#!/usr/bin/env node

import 'dotenv/config'
import puppeteer, {Page} from 'puppeteer';

require('dotenv').config()


const tasks = [
    new Task('', 'Daily', '0:15'),
    new Task('ORAMY-98', 'ORAMY Test', '1:15'),
    new Task('ORGSESE-104', 'ORGSESE Test', '1:15'),
    new Task('SM-102', 'SM Test', '1:15'),
];

const quit = () => {
    process.exit(1);
}

(async () => {
    const baseUrl = process.env.BCS_URL
    const username = process.env.BCS_USERNAME
    const password = process.env.BCS_PASSWORD

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({width: 1080, height: 1024});

    await page.goto(`${baseUrl}/bcs/login`).catch(error => {
        console.log(`❌ Not able to reach ${baseUrl} - is bcs_url correct and accessible?`)
        browser.close()
        quit()
    });

    await page.type('#label_user', username);
    await page.type('#label_pwd', password);

    await page.click('#loginbutton')

    await page.waitForSelector('input.notificationPermissionLater')
        .then((btn) => btn.click());

    tasks.forEach(task => insertTask(page, task));

    // await browser.close()

})();


async function insertTask(page: Page, task: Task) {
    if (task.projectId) {
        await page.evaluate(task => {
            const rowsForProjectId = document.querySelectorAll(`tr[data-listtaskgroupoid="${task.projectId}_JTask"]`);
            const lastRowForProjectId = rowsForProjectId[rowsForProjectId.length - 1]

            const hourInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(1)`) as HTMLInputElement;
            hourInput.value = task.hours;

            const minuteInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(3)`) as HTMLInputElement;
            minuteInput.value = task.minutes;

            const descriptionInput = lastRowForProjectId.querySelector(`td[name="description"] > textarea`) as HTMLInputElement;
            descriptionInput.value = task.description;
        }, task);

        const plusButton = await page.$(`tr[data-listtaskgroupoid="${task.projectId}_JTask"] > td[name="[plusminus]"] > button`)
        await plusButton.click()
    }
}
