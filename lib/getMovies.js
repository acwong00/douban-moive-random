var fs = require('fs');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');

var movies = [];

var getMoviesInfo = function(user) {
  var startUrl = `https://movie.douban.com/people/${user}/wish`;
  var urls = [startUrl];

  return new Promise(function(resolve, reject) {
    superagent
      .get(startUrl)
      .end(function (err, res) {
        if (err) {
          err.errType = 'network';
          reject(err);
          return;
        }

        var $ = cheerio.load(res.text, {decodeEntities: false});
        var $links = $('.paginator').children('a');

        if ($links.length === 0) {
          reject({
            errType: 'empty'
          });
          return;
        }

        $links.each(function (index, link) {
          urls.push($(link).attr('href'));
        });

        async.mapLimit(urls, 1, function (url, callback) {
          getMovieInfo(url, callback);
        }, function (err, res) {
          if (!err) {
            resolve(movies);
          } else {
            err.errType = 'async';
            reject(err);
          }
        });
      });
  })

  
};

var getMovieInfo = function(url, callback) {
  superagent
    .get(url)
    .end(function (err, res) {
      var $ = cheerio.load(res.text, {decodeEntities: false});

      $('.title').each(function (index, item) {
        var $item = $(item);

        movies.push({
          href: $item.find('a').attr('href'),
          text: $item.find('em').text()
        });
      });

      callback(null, null);
    });
}

module.exports = {
  getMoviesInfo: getMoviesInfo
}