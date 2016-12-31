// 14:38
const program = require('commander');
const pjson = require('./package.json');

program
  .version(pjson.version)
  .option('-u, --user [user]', 'User id', c);

// program.command('250')
  



function c(user) {
  console.log(user);
}

// console.log('input username');
// process.stdin.on('data', function (text) {
//   // console.log('received data:', util.inspect(text));
//   if (text === 'quit\n') {
//     done();
//   }
// });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });


program.parse(process.argv);

console.log(program);