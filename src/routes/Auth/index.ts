import { controllers } from '../../controllers/Auth';
import { Strategies } from '../../../types/Auth/Strategies/interfaces';
import * as V from '../../../types/Auth/Route';

export default [
  {
    method: 'GET',
    path: '/example',
    handler: controllers.test,
    options: {
      auth: {
        strategies: [Strategies.static],
      },
      cors: true,
      description: 'Закрытый эндпоинт на получение текста',
      tags: ['api', 'auth'],
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Возвращает текст',
            },
            400: {
              description: 'Возвращает ошибку',
            },
          },
        },
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: controllers.loginUser,
    options: {
      cors: true,
      validate: {
        payload: <any>V.loginUserPayload,
      },
      tags: ['api', 'auth'],
      description: 'Авторизация пользователя',
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Возвращает сообщение с успешной авторизацией',
            },
            400: {
              description: 'Возвращает ошибку',
            },
          },
        },
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/registration',
    handler: controllers.registrationUser,
    options: {
      cors: true,
      validate: {
        payload: <any>V.loginUserPayload,
      },
      tags: ['api', 'auth'],
      description: 'Регистрация пользователя',
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Возвращает сообщение с успешной регистрации',
            },
            400: {
              description: 'Возвращает ошибку',
            },
          },
        },
      },
    },
  },
];
