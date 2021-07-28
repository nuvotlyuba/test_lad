import _ from 'lodash';
import * as Joi from 'typesafe-joi';

export const loginUserPayload = Joi.object().keys({
    login: Joi.string()
      .required()
      .description('Логин пользователя')
      .example('admin_1@mail.ru'),
    password: Joi.string()
      .required()
      .description('Пароль пользователя')
      .example('admin_1'),
  });