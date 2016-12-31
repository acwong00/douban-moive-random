#!/usr/bin/env node

const program = require('commander');
const pjson = require('./package.json');
const getRandomMovie = require('./lib').getRandomMovie;

program
  .version(pjson.version)
  .option('-u, --user [user]', 'User id', getRandomMovie);

program.parse(process.argv);