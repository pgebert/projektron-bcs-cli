#!/usr/bin/env node

import puppeteer from 'puppeteer';

class Task {
    constructor(ticket, description, time) {
        this.ticket = ticket;
        this.description = description;
        this.hours = this.splitTime(time)[0];
        this.minutes = this.splitTime(time)[1];
        this.projectId = this.getProjectId();
    }

    splitTime(time) {
        return time.split(":").map(t => t ? t : 0);
    }

    getProjectId() {
        const patterns = [
            {regex: /daily/i, value: '1678898995032', source: 'description'},
            {regex: /orgsese-/i, value: '1678898695172', source: 'ticket'},
            {regex: /oramy-/i, value: '1678898995032', source: 'ticket'},
            {regex: /sm-/i, value: '1686218840677', source: 'ticket'},
        ];

        for (let pattern of patterns) {
            if (pattern.regex.test(this[pattern.source])) {
                return pattern.value;
            }
        }
        return null;
    }
}

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

    const notificationDialogButton = await page.$('input.notificationPermissionLater')
    await notificationDialogButton.click()

    tasks.forEach(task => insertTask(page, task));

})();

async function insertTask(page, task) {
    if (task.projectId) {
        await page.evaluate(task => {
            const rowsForProjectId = Array.from(document.querySelectorAll(`tr[data-listtaskgroupoid="${task.projectId}_JTask"]`));
            const lastRowForProjectId = rowsForProjectId[rowsForProjectId.length - 1]

            const hourInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(1)`);
            hourInput.value = task.hours;

            const minuteInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(3)`);
            minuteInput.value = task.minutes;

            const descriptionInput = lastRowForProjectId.querySelector(`td[name="description"] > textarea`);
            descriptionInput.value = task.description;
        }, task);

        const plusButton = await page.$(`tr[data-listtaskgroupoid="${task.projectId}_JTask"] > td[name="[plusminus]"] > button`)
        await plusButton.click()
    }
}
