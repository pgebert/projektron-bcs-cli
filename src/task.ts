class Task {
    ticket: string
    description: string
    hours: string
    minutes: string
    projectId: string

    constructor(ticket: string, description: string, time: string) {
        this.ticket = ticket;
        this.description = description;
        this.hours = this.splitTime(time)[0];
        this.minutes = this.splitTime(time)[1];
        this.projectId = this.getProjectId();
    }

    splitTime(time: string): string[] {
        return time.split(":").map(t => t ? t : '0');
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
