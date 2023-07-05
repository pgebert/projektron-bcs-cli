import {toMinutes, toTimeString} from "./utils";

interface ITask {
    ticket: string
    description: string
    time: string
}

interface IPattern {
    regex: RegExp;
    value: string;
    source: keyof ITask;
}


export class Task {
    ticket: string
    description: string
    minutes: number
    projectId: string

    constructor({ticket, description, time}: ITask) {
        this.ticket = ticket;
        this.description = description;
        this.minutes = toMinutes(time);
        this.projectId = this.getProjectId();

    }

    getProjectId() {
        const patterns: IPattern[] = [
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

    toString(): string {
        const {description, ticket, minutes} = this;
        return `Task(description: ${description}, ticket: ${ticket}, time: ${toTimeString(minutes)})`;
    }
}
