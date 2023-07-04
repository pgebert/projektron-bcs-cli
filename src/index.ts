#!/usr/bin/env node

import 'dotenv/config'
import {BcsClient} from './bcsClient';

require('dotenv').config()


const tasks = [
    new Task('', 'Daily', '0:15'),
    new Task('ORAMY-98', 'ORAMY Test', '1:15'),
    new Task('ORGSESE-104', 'ORGSESE Test', '1:15'),
    new Task('SM-102', 'SM Test', '1:15'),
];


const bcsClient = new BcsClient()
bcsClient.add(tasks).catch(console.error);
