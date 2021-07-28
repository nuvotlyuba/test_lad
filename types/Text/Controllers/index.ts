import * as Joi from 'typesafe-joi';
import * as V from '../validation';

export type textPayload = Joi.Literal<typeof V.textPayload>;
