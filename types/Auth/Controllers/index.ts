import * as Joi from 'typesafe-joi';
import * as V from '../validation';

export type authObjectResponse = Joi.Literal<typeof V.authObjectResponse>;
export type loginUserPayload = Joi.Literal<typeof V.loginUserPayload>;
