const userError = {
  notFoundUserId: 'Пользователь по указанному _id не найден',
  incorrectDataForGetUser: 'Переданы некорректные данные для получения пользователя',
  emailConflictError: 'Пользователь с таким email уже существует',
  incorrectDataForCreateUser: 'Переданы некорректные данные при создании пользователя',
  incorrectDataForUpdateUser: 'Переданы некорректные данные при обновлении пользователя',
};

const movieError = {
  incorrectDataForCreateMovie: 'Переданы некорректные данные при создании фильма',
  forbiddenErrorMovie: 'Невозможно удалить чужой фильм',
  notFoundMovieId: 'Фильм с указанным _id не найден',
  invalidMovieId: 'Невалидный _id фильма',
};

const authError = {
  authError: 'Необходима авторизация',
};

const modelUserError = {
  incorrectData: 'Неправильные почта или пароль',
};

const notFoundPage = {
  notFoundPage: 'Страница не найдена',
};

const serverError = {
  serverError: 'На сервере произошла ошибка',
};

const modelMovieError = {
  incorrectUrl: 'Некорректный url',
};

module.exports = {
  userError,
  movieError,
  authError,
  modelUserError,
  notFoundPage,
  serverError,
  modelMovieError,
};
