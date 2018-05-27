module.exports = len => {
  const symbols = 'qwertyuiopasdfghjklzxcvbnm1234567890';
  var result = '';
  for (var i = 0; i < len; i++) {
    result += symbols[Math.floor(Math.random() * symbols.length)];
  }
  return result;
}