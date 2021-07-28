// import _ from 'lodash';
import * as Joi from 'typesafe-joi';

export const optionsDataErrorGenerator = Joi.object({
  typeError: Joi.string()
    .required()
    .description(
      'Тип ошибки. Указать каким сервисом сгенерировано исключение. Базой данных, внешним сервисом, базовый тип'
    ),
  meta: Joi.object()
    .optional()
    .description('Объект для добавления дополнительной информации'),
});

