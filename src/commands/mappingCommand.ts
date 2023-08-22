import {readFromFile, writeToFile} from "../utils/fileUtils";
import * as path from "path";

const {Input} = require('enquirer');

const mappingFilePath = path.resolve(__dirname, 'mapping.json')

interface MappingItem {
    source: string;
    regex: string;
    projectId: number;
}


export const handleMappingCommand = async () => {

    const mappingFile = readFromFile(mappingFilePath) || '[]';
    const mapping = JSON.parse(mappingFile);

    const validateTaskToProjectMapping = (input: string): string | boolean => {
        try {
            const mapping: MappingItem[] = input
                .split('\n')
                .filter(m => m)
                .map(m => JSON.parse(m));

            const isValidMapping = mapping.every(item =>
                'source' in item && 'regex' in item && 'projectId' in item
            );

            if (!isValidMapping) {
                return 'Mapping should have the format {"source":"<description|ticket>","regex":"<regex>","projectId":<number>}';
            }

            const validSources = ['description', 'ticket'];
            const hasValidSource = mapping.every(item =>
                validSources.includes(item.source)
            );

            if (!hasValidSource) {
                return "Invalid value for 'source' field - valid values are 'description' and 'ticket'";
            }

        } catch (e) {
            if (e instanceof SyntaxError) {
                return 'Please provide the mapping in valid JSON format.';
            }
            return false;
        }
        return true;
    };

    const prompt = new Input({
        message: 'Please edit the task to projectId mapping:',
        initial: mapping.map(m => "\n" + JSON.stringify(m)).join(""),
        footer: '\nPress \"tab\" to insert and edit the existing mapping. Press \"enter\" two time to save your input.',
        multiline: true,
        validate: validateTaskToProjectMapping
    });

    await prompt.run()
        .then(input => {
            const mapping = input.split("\n").filter(m => m).map(m => JSON.parse(m));
            // console.log('ANSWER', mapping);
            writeToFile(mappingFilePath, JSON.stringify(mapping));
        })
        .catch(console.log);

}
