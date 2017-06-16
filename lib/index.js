const superagent = require('superagent')
const { promisify } = require('util')
const cheerio = require('cheerio')
const colors = require("colors/safe")
const Conf = require('conf')
const loading = require('./loading')
const handleError = require('./handleError')
const config = new Conf()

class RandomMovie {
  constructor(user) {
    this.user = user
    this.urls = [`https://movie.douban.com/people/${user}/wish`]
    this.$ = null
  }

  async getRandomMovie() {
    loading.start()

    const num = await this.getTotalNum()

    if (num === 0) {
      loading.clear()
      return
    }

    for (let i = 1; i < Math.ceil(num / 15); i++) {
      this.urls.push(`https://movie.douban.com/people/${this.user}/wish?start=${i * 15}`)
    }

    const $title = await this.getMovieTitle(num)

    loading.clear()

    this.showMovie($title)

    config.set('user', this.user)
  }

  async getTotalNum() {
    const startUrl = this.urls[0]

    try {
      const res = await superagent.get(startUrl)

      const $ = cheerio.load(res.text, {
        decodeEntities: false
      })

      const $h1 = $('#db-usr-profile').find('h1')

      return /\d+/.exec($h1.html())[0]

    } catch(err) {
      handleError(err, 'network', this.user)
    }
  }

  async getMovieTitle(num) {
    const randomNum = Math.floor(Math.random() * num) + 1

    if (randomNum <= 15) {
      return this.$('.title').eq(randomNum - 1)
    } else {
      const page = Math.floor((randomNum - 1) / 15)
      
      try {
        const res = await superagent.get(this.urls[page])

        this.$ = cheerio.load(res.text, {
          decodeEntities: false
        })

        return this.$('.title').eq(randomNum % 15 - 1)
      } catch(err) {
        handleError(err, 'network', this.user)
      }
    }
  }

  showMovie($title) {
    const href = $title.find('a').attr('href')
    const text = $title.find('em').text()

    console.log(colors.green('random movie is ') + colors.yellow(text))
    console.log(colors.cyan.underline(href))
  }
}

module.exports = RandomMovie