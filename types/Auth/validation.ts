import * as Joi from 'typesafe-joi';

export const authObjectResponse = Joi.object({
  isValid: Joi.boolean()
    .required()
    .description('Статус авторизации пользователя'),
  credentials: Joi.object({
    scope: Joi.array().required().description('Права доступа пользователя'),
    token: Joi.string().required().description('Токен пользователя'),
    user: Joi.object().required().description('Учетные данные пользователя'),
  })
    .required()
    .description('Обект полномочий пользователя'),
});

export const loginUserPayload = Joi.object({
  login: Joi.string().required().description('Логин пользователя'),
  password: Joi.string().required().description('Пароль пользователя'),
});
