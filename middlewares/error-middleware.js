// центральный обработчик ошибки
const errorMiddleware = ((error, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500;
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

module.exports = { errorMiddleware };
