import puppeteer, {Page} from "puppeteer";

interface BcsClientInterface {
    add(tasks: Task[]): void;
}


const quit = () => {
    process.exit(1);
}

export class BcsClient implements BcsClientInterface {

    private baseUrl = process.env.BCS_URL
    private username = process.env.BCS_USERNAME
    private password = process.env.BCS_PASSWORD

    async add(tasks: Task[]): Promise<void> {
        const browser = await puppeteer.launch({headless: false});
        try {
            const page = await browser.newPage();
            await page.setViewport({width: 1080, height: 1024});

            await this.login(page);

            for (const task of tasks) {
                await this.insertTask(page, task);
            }
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

    private async insertTask(page: Page, task: Task) {
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

}
