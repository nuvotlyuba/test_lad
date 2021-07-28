import * as Joi from 'typesafe-joi';

export const textPayload = Joi.object({
  text: Joi.string().required().description('Текст'),
});
