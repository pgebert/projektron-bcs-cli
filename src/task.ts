import {Time} from "./time";
import {readFromFile} from "./utils/fileUtils";

import * as path from "path";

const mappingFilePath = path.resolve(__dirname, 'mapping.json')

interface ITask {
    ticket: string
    description: string
    time: string
    projectId?: string
}

interface IPattern {
    regex: RegExp;
    projectId: string;
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
        // const patterns: IPattern[] = [
        //     {regex: /daily/i, value: '1678898995032', source: 'description'},
        //     {regex: /orgsese-/i, value: '1678898695172', source: 'ticket'},
        //     {regex: /oramy-/i, value: '1678898995032', source: 'ticket'},
        //     {regex: /sm-/i, value: '1686218840677', source: 'ticket'},
        // ];

        const mappingFile = readFromFile(mappingFilePath) || '[]';
        const mapping = JSON.parse(mappingFile);

        const patterns: IPattern[] = mapping.map(m => ({
            regex: RegExp(m.regex, 'i'),
            source: m.source,
            projectId: m.projectId
        }));

        for (let pattern of patterns) {
            if (pattern.regex.test(<string>this[pattern.source])) {
                return pattern.projectId;
            }
        }
        return '1678899081811';
    }

    toString(): string {
        const {description, ticket, time} = this;
        return `Task(description: ${description}, ticket: ${ticket}, time: ${time})`;
    }
}
