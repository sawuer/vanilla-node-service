const crypto = require('crypto');

module.exports = (str, salt) => {
  if (typeof str == 'string') {
    return crypto.createHmac('sha256', salt).update(str).digest('hex');
  }
}