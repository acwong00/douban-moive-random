var superagent = require('superagent');
var cheerio = require('cheerio');
var colors = require("colors/safe");
var loading = require('./loading');

var urls = [];

var getRandomMovie = function(user) {
  urls.push(`https://movie.douban.com/people/${user}/wish`);

  loading.start();

  getTotalNum(user)
    .then(function(res) {
      if (res.num === 0) {
        loading.clear();
        return;
      }

      for (var i = 1; i < Math.ceil(res.num / 15); i++) {
        urls.push(`https://movie.douban.com/people/${user}/wish?start=${i * 15}`);
      }

      var movieNum = getRandom(res.num);
      showMovie(movieNum, res.num, res.$);
    }).catch(function(err, type) {
      loading.clear();
      handleErr(err, type, user);
    });
};

var showMovie = function(num, $) {
  getMovieInfo(num, $)
    .then(function($title) {
      loading.clear();
      var href = $title.find('a').attr('href');
      var text = $title.find('em').text();

      console.log(colors.green('random movie is ') + colors.yellow(text));
      console.log(colors.cyan.underline(href));
    });
};

var getMovieInfo = function(num, $) {
  return new Promise(function(resolve, reject) {
    if (num <= 15) {
      resolve($('.title').eq(num - 1));
    } else {
      var page = Math.floor((num - 1) / 15);
      superagent
        .get(urls[page])
        .end(function(err, res) {
          if (err) {
            err.errType = 'network';
            reject(err);
            return;
          }
          var _$ = cheerio.load(res.text, {
            decodeEntities: false
          });
          resolve(_$('.title').eq(num % 15 - 1));
        });
    }
  });
}


var getRandom = function (max) {
  var min = 1;
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
};

var getTotalNum = function(user) {
  var startUrl = urls[0];

  return new Promise(function(resolve, reject) {
    superagent
      .get(startUrl)
      .end(function(err, res) {
        if (err) {
          err.errType = 'network';
          reject(err);
          return;
        }

        var $ = cheerio.load(res.text, {
          decodeEntities: false
        });

        var $h1 = $('#db-usr-profile').find('h1');

        var moviesNum = /\d+/.exec($h1.html())[0];

        resolve({
          num: moviesNum,
          $: $
        });
      });
  });
};

var handleErr = function(err, type, user) {
  if (err.errType === 'network') {
    if (err.response.statusCode === 404) {
      console.log(`Can't find user ${user}`);
    }
  } else if (err.errType === 'empty') {
    console.log(`Can't find wish movies of ${user}`);
  } else {
    console.log(`Error`);
  }
};

module.exports = {
  getRandomMovie: getRandomMovie
}