import * as Hapi from '@hapi/hapi';

export interface AuthorizationObject<
  Crds extends object = object,
  B extends boolean = boolean,
  A extends object = object
> {
  isValid: B;
  credentials: Crds;
  artifacts?: A;
}

export enum Strategies {
  static = 'static',
}

export type Authorization<
  R = Hapi.Request,
  T = string,
  H = Hapi.ResponseToolkit,
  Res = AuthorizationObject
> = (request: R, token: T, h: H) => Promise<Res>;

export type BearerAuthorization<
  T = string,
  R = Hapi.Request,
  Res = AuthorizationObject
> = (request: R, token: T) => Promise<Res>;

export type AuthService = (config) => {
  [Strategies.static]: Authorization;
};
