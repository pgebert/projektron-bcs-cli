import puppeteer, {Browser, Page} from "puppeteer";
import {Task} from "./task";


interface BcsClientInterface {
    add(date: Date, tasks: Task[]): Promise<void>

    fetch(date: Date): Promise<Task[]>

    reset(date: Date): Promise<void>
}

export class BcsClient implements BcsClientInterface {

    private static instance: BcsClient;
    private headless: boolean | 'new' = false
    private viewport = {width: 1080, height: 1024}
    private baseUrl: string
    private browser: Browser
    private page: Page

    private constructor() {
    }

    private _isConnected: boolean = false

    get isConnected(): boolean {
        return this._isConnected;
    }

    public static async getInstance(): Promise<BcsClient> {
        if (!BcsClient.instance) {
            BcsClient.instance = new BcsClient();
        }

        return BcsClient.instance;
    }

    async connect(baseUrl: string, username: string, password: string): Promise<boolean> {

        this.baseUrl = baseUrl

        this.browser = await puppeteer.launch({headless: this.headless});

        this.page = await this.browser.newPage();
        await this.page.setViewport(this.viewport);

        await this.page.goto(`${baseUrl}/bcs/login`)

        await this.page.type('#label_user', username);
        await this.page.type('#label_pwd', password);
        await this.page.click('#loginbutton');

        // TODO fail fast on failed login
        await this.page.waitForSelector('input.notificationPermissionLater')
            .then((btn) => btn.click());

        this._isConnected = true;

        return true
    }

    async close() {
        this._isConnected = false;
        await this.browser.close().then();
    }


    async add(date: Date, tasks: Task[]): Promise<void> {

        // TODO goto page and assert loggedIn
        await this.selectDate(date);

        for (const task of tasks) {
            await this.insertTask(task);
        }

        await this.save();
    }

    async fetch(date: Date): Promise<Task[]> {

        // TODO goto page and assert loggedIn
        await this.selectDate(date);

        return await this.fetchTasks()

    }

    async reset(date: Date): Promise<void> {
        // TODO goto page and assert loggedIn
        await this.selectDate(date);

        await this.resetAllTasks();

        await this.save();
    }


    private async save() {

        await this.page.waitForSelector('input.button[data-bcs-button-name="Apply"]')
            .then((btn) => btn.click());

        await this.page.waitForSelector('div#TimeRecordingService_Success')
    }

    private async insertTask(task: Task) {
        if (task.projectId) {
            await this.page.evaluate(task => {

                const rowsForProjectId = document.querySelectorAll(`tr[data-listtaskgroupoid="${task.projectId}_JTask"]`);
                const lastRowForProjectId = rowsForProjectId[rowsForProjectId.length - 1];

                const timeInput = lastRowForProjectId.querySelector(`td[name="effortExpense"] > span > input:nth-child(3)`) as HTMLInputElement;
                timeInput.value = task.time.minutes.toString();

                // TODO ticket number

                const descriptionInput = lastRowForProjectId.querySelector(`td[name="description"] > textarea`) as HTMLInputElement;
                descriptionInput.value = task.description;
            }, task);

            const plusButton = await this.page.$(`tr[data-listtaskgroupoid="${task.projectId}_JTask"] > td[name="[plusminus]"] > button`)
            await plusButton.click()
        }
    }

    private async fetchTasks(): Promise<Task[]> {

        const values = await this.page.evaluate(async () => {

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

    private async resetAllTasks() {

        await this.page.evaluate(() => {

            const cleanButtons = document.querySelectorAll("a.cleanTimeRecordingRow_Link")
            cleanButtons.forEach(button => (button as HTMLInputElement).click())
        });

    }

    private async selectDate(date: Date) {

        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()

        await Promise.all([
            this.page.evaluate(([year, month, day]) => {

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
            this.page.waitForSelector('a.dayHighlighted').then((btn) => btn.click()),
            this.page.waitForNavigation()
        ]);
    }
}
