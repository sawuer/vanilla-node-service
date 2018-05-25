module.exports = obj => {
  for (it in obj) {
    if (obj[it] === '' || obj[it] === null) {
      return true;
    }
  }
  return false;
}