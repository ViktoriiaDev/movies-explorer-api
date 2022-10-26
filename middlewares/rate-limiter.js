const rateLimit = require('express-rate-limit');

module.exports.rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // limit each IP to 2 requests per windowMs
  message: 'Ваш лимит запросов к серверу превышен',
});
