import _ from 'lodash';
import * as Joi from 'typesafe-joi';

export const textPayload = Joi.object().keys({
  text: Joi.string()
    .required()
    .description('Текст для исправления')
    .example('Exampl fooor exampla'),
});
