import {readFromFile, writeToFile} from "../utils/fileUtils";

const {Input} = require('enquirer');

interface MappingItem {
    source: string;
    regex: string;
    projectId: number;
}


export const handleMappingCommand = async () => {

    const mappingFile = readFromFile('mapping.json') || '[]';
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
        multiline: true,
        validate: validateTaskToProjectMapping
    });

    await prompt.run()
        .then(input => {
            const mapping = input.split("\n").filter(m => m).map(m => JSON.parse(m));
            // console.log('ANSWER', mapping);
            writeToFile('mapping.json', JSON.stringify(mapping));
        })
        .catch(console.log);

}