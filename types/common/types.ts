import * as Joi from 'typesafe-joi';
import * as V from './validations';

export type optionsDataErrorGenerator = Joi.Literal<
  typeof V.optionsDataErrorGenerator
>;
