var colors = require("colors/safe");
var getMoviesInfo = require('./getMovies').getMoviesInfo;
var loading = require('./loading');

var getRandomMovie = function(user) {
  loading.start();

  getMoviesInfo(user)
    .then(function(movies) {
      loading.clear();
      showMovie(getRandom(movies));
    }).catch(function(err, type) {
      loading.clear();
      handleErr(err, type, user);
    });
};

var getRandom = function (arr) {
  var max = arr.length - 1;
  var min = 0;
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return arr[random]
};

var showMovie = function(movie) {
  console.log(colors.green('random movie is') + colors.yellow(` ${movie.text}`));
  console.log(colors.cyan.underline(movie.href));
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