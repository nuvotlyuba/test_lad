import { controllers } from '../../../controllers/Text';

import * as V from '../../../../types/Text/Route';
import { Strategies } from '../../../../types/Auth/Strategies/interfaces';

export default [
  {
    method: 'POST',
    path: '/text/correct',
    handler: controllers.textCorrect,
    options: {
      auth: {
        strategies: [Strategies.static],
      },
      cors: true,
      validate: {
        payload: <any>V.textPayload,
      },
      tags: ['api', 'auth'],
      description: 'Исправление текста',
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Возвращает сообщение о успешном исправлении текста',
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
