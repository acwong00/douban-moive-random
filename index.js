#!/usr/bin/env node

const program = require('commander');
const prompt = require('prompt');
const colors = require("colors/safe");
const pjson = require('./package.json');
// const getRandomMovie = require('./lib').getRandomMovie;
const RandomMovie = require('./lib')

program
  .version(pjson.version);

program.parse(process.argv);

if (program.args.length === 0) {
  prompt.message = colors.green('');

  prompt.start();
  prompt.get({
    properties: {
      userid: {
        type: 'string',
        required: true,
        message: colors.red('Please input douban id or nickname'),
        description: colors.green('Please input douban id or nickname')
      }
    }
  }, function(err, result) {
    if (err) {
      throw err;
    }
    // getRandomMovie(result.userid);
    const randomMovie = new RandomMovie(result.userid)
    randomMovie.getRandomMovie()
  });
}
