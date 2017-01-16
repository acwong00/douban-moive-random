#!/usr/bin/env node

var program = require('commander');
var prompt = require('prompt');
var colors = require("colors/safe");
var pjson = require('./package.json');
var getRandomMovie = require('./lib').getRandomMovie;

program
  .version(pjson.version);
  // .option('-u, --user [user]', 'User id', getRandomMovie);

program
  .command('hello')
  .action(function(env, options) {
    // console.log(env, options);
  });

program.parse(process.argv);

if (program.args.length === 0) {
  prompt.message = colors.green('');
  // prompt.delimiter = colors.green('>>')

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
    getRandomMovie(result.userid);
  });
}
// console.log(program);