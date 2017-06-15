const colors = require("colors/safe")

module.exports = {
  timer: null,
  start: function() {
    var P = ["\\", "|", "/", "-"]
    var x = 0
    this.timer = setInterval(function() {
      process.stdout.write("\r" + colors.rainbow(P[x++]))
      x &= 3
    }, 250)
  },
  clear: function() {
    process.stdout.write("\r")
    clearInterval(this.timer)
  }
}