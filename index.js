#!/usr/bin/env node

const program = require('commander')
const prompt = require('prompt')
const colors = require("colors/safe")
const pjson = require('./package.json')
const Conf = require('conf')
// const getRandomMovie = require('./lib').getRandomMovie
const RandomMovie = require('./lib')

const config = new Conf()

async function main() {
  program
    .version(pjson.version)
    .option('-u, --user [user]', 'Set user')
    .parse(process.argv)

  const user = await getUser(program);

  const randomMovie = new RandomMovie(user)
  randomMovie.getRandomMovie()
}

function getUser(program) {
  return new Promise((resolve, reject) => {
    if (program.user && program.user !== true) {
      resolve(program.user)
    } else if (config.get('user')) {
      resolve(config.get('user'))
    } else if (program.user === true || program.args.length === 0) {
      prompt.message = colors.green('')

      prompt.start()
      prompt.get({
        properties: {
          user: {
            type: 'string',
            required: true,
            message: colors.red('Please input douban id or nickname'),
            description: colors.green('Please input douban id or nickname')
          }
        }
      }, (err, result) => {
        resolve(result.user)
      })
    }
  })
}

main()