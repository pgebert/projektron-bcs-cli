import {Time} from "./time";

interface ITask {
    ticket: string
    description: string
    time: string
    projectId?: string
}

interface IPattern {
    regex: RegExp;
    value: string;
    source: keyof ITask;
}


export class Task {
    ticket: string
    description: string
    time: Time
    projectId: string

    constructor({ticket, description, time, projectId}: ITask) {
        this.ticket = ticket;
        this.description = description;
        this.time = Time.fromString(time);
        this.projectId = projectId || this.deriveProjectId();

    }

    deriveProjectId() {
        const patterns: IPattern[] = [
            {regex: /daily/i, value: '1678898995032', source: 'description'},
            {regex: /orgsese-/i, value: '1678898695172', source: 'ticket'},
            {regex: /oramy-/i, value: '1678898995032', source: 'ticket'},
            {regex: /sm-/i, value: '1686218840677', source: 'ticket'},
        ];

        for (let pattern of patterns) {
            if (pattern.regex.test(<string>this[pattern.source])) {
                return pattern.value;
            }
        }
        return '1678899081811';
    }

    toString(): string {
        const {description, ticket, time} = this;
        return `Task(description: ${description}, ticket: ${ticket}, time: ${time})`;
    }
}
