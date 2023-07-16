import puppeteer, {Page} from "puppeteer";
import {Task} from "./task";


interface BcsClientInterface {
    add(tasks: Task[]): Promise<void>

    fetch(date: Date): Promise<Task[]>

    reset(date: Date): Promise<void>
}


const quit = () => {
    process.exit(1);
}

export class BcsClient implements BcsClientInterface {

    private baseUrl = process.env.BCS_URL
    private username = process.env.BCS_USERNAME
    private password = process.env.BCS_PASSWORD

    // private headless = false
    private headless: boolean | 'new' = 'new'
    private viewport = {width: 1080, height: 1024}

    async add(tasks: Task[]): Promise<void> {
        const browser = await puppeteer.launch({headless: this.headless});
        try {
            const page = await browser.newPage();
            await page.setViewport(this.viewport);

            await this.login(page);

            for (const task of tasks) {
                await this.insertTask(page, task);
            }

            await this.save(page);
        } finally {
            await browser.close();
        }

    }

    async fetch(date: Date): Promise<Task[]> {
        let tasks = [];

        const browser = await puppeteer.launch({headless: this.headless});
        try {
            const page = await browser.newPage();
            await page.setViewport(this.viewport);

            await this.login(page);

            await this.selectDate(page, date);

            tasks = await this.fetchTasks(page)

        } finally {
            await browser.close();
        }
        return tasks;
    }

    async reset(date: Date): Promise<void> {
        const browser = await puppeteer.launch({headless: this.headless});
        try {
            const page = await browser.newPage();
            await page.setViewport(this.viewport);

            await this.login(page);

            await this.selectDate(page, date);

            await this.resetAllTasks(page);

            await this.save(page);
        } finally {
            await browser.close();
        }

    }

    private async login(page: Page) {
        await page.goto(`${this.baseUrl}/bcs/login`).catch(error => {
            console.log(`❌ Failed to reach ${this.baseUrl} - check if BCS_URL is correct and accessible.`);
            throw error;
        });

        await page.type('#label_user', this.username);
        await page.type('#label_pwd', this.password);
        await page.click('#loginbutton');

        await page.waitForSelector('input.notificationPermissionLater')
            .then((btn) => btn.click());
    }

    private async save(page: Page) {

        await page.waitForSelector('input.button[data-bcs-button-name="Apply"]')
            .then((btn) => btn.click());

        await page.waitForSelector('div#TimeRecordingService_Success')
    }

    private async insertTask(page: Page, task: Task) {
        if (task.projectId) {
            await page.evaluate(task => {

                const rowsForProjectId = document.querySelectorAll(`tr[data-listtaskgroupoid="${task.projectId}_JTask"]`);
                const lastRowForProjectId = rowsForProjectId[rowsForProjectId.length - 1];

                const timeInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(3)`) as HTMLInputElement;
                timeInput.value = task.time.minutes.toString();

                // TODO ticket number

                const descriptionInput = lastRowForProjectId.querySelector(`td[name="description"] > textarea`) as HTMLInputElement;
                descriptionInput.value = task.description;
            }, task);

            const plusButton = await page.$(`tr[data-listtaskgroupoid="${task.projectId}_JTask"] > td[name="[plusminus]"] > button`)
            await plusButton.click()
        }
    }

    private async fetchTasks(page: Page): Promise<Task[]> {

        const values = await page.evaluate(async () => {

            const values = [];

            const rows = document.querySelectorAll('table[id="daytimerecording,Content,daytimerecordingTaskList_table"] > tbody > tr[data-listtaskgroupoid]');

            rows.forEach(row => {
                const descriptionInput = row.querySelector(`td[name="description"] > textarea`) as HTMLInputElement;
                const ticketInput = row.querySelector(`td[name="effortAttr1"] > input`) as HTMLInputElement;
                const hourInput = row.querySelector(`td[name="effortExpense"] > span > input:nth-child(1)`) as HTMLInputElement;
                const minuteInput = row.querySelector(`td[name="effortExpense"] > span > input:nth-child(3)`) as HTMLInputElement;
                const projectId = row.getAttribute("data-listtaskgroupoid").replace('_JTask', '');

                if (descriptionInput.value !== '' || ticketInput.value !== '') {
                    values.push({
                        ticket: ticketInput.value,
                        description: descriptionInput.value,
                        time: `${hourInput.value}:${minuteInput.value}`,
                        projectId: projectId
                    });
                }
            })

            return values;

        });

        return values.map(value => new Task(value));

    }

    private async resetAllTasks(page: Page) {

        await page.evaluate(() => {

            const cleanButtons = document.querySelectorAll("a.cleanTimeRecordingRow_Link")
            cleanButtons.forEach(button => (button as HTMLInputElement).click())
        });

    }

    private async selectDate(page: Page, date: Date) {

        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()

        await Promise.all([
            page.evaluate(([year, month, day]) => {

                //@ts-ignore
                PopupCalendar.reloadPageByCalendar(
                    'daytimerecording,Selections,effortRecordingDate',
                    year,
                    month,
                    day,
                    'daytimerecording,Selections,effortRecordingDate',
                    'popupCalendarLink.daytimerecording,Selections,effortRecordingDate'
                );

            }, [year, month, day]),
            page.waitForSelector('a.dayHighlighted').then((btn) => btn.click()),
            page.waitForNavigation()
        ]);
    }


}
