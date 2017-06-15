module.exports = (err, type, user) => {
  if (err.errType === 'network') {
    if (err.response.statusCode === 404) {
      console.log(`Can't find user ${user}`)
    }
  } else {
    console.log(`Error`)
    console.log(err)
  }
  process.exit()
}