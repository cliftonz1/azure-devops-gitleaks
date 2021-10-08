import * as mr from 'azure-pipelines-task-lib/mock-run';
import * as mtr from 'azure-pipelines-task-lib/mock-toolrunner';
import path = require('path');
import os = require('os');
import * as helpers from './MockHelper';
import { TaskLibAnswers } from 'azure-pipelines-task-lib/mock-answer';

const taskPath = path.join(__dirname, '..', 'index.js');
let tmr: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

// Inputs
tmr.setInput('version', 'latest');
tmr.setInput('configType', 'default');

tmr.setInput('scanfolder', __dirname);

tmr.setInput('arguments', 'true');
tmr.setInput('verbose', 'false');
tmr.setInput('uploadresults', 'false');
tmr.setInput('arguments', '--arg1=value --arg2');

const executable = 'gitleaks-darwin-amd64';
helpers.BuildWithDefaultValues();
tmr = helpers.BuildWithEmptyToolCache(tmr);
tmr = helpers.BuildWithDefaultMocks(tmr);
tmr.registerMock('azure-pipelines-task-lib/toolrunner', mtr);
tmr.setAnswers(<TaskLibAnswers>{
        exec: {
                [createToolCall()]: {
                        'code': 0,
                        'stdout': 'Gitleaks tool contsole output',
                },
        }
});

tmr.run();


function createToolCall(): string {
	const toolCall = `/tool/${executable} --path=${__dirname} --report=${helpers.reportFile()} --arg1=value --arg2`;
	console.log(toolCall);
	return toolCall;
}