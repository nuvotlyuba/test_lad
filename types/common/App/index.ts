import jwt from 'jsonwebtoken';
import Hapi from '@hapi/hapi';

export enum EnvVars {
  NODE_ENV = 'environment',
  API_VERSION = 'apiVersion',
  SERVER_PORT = 'serverPort',
  ROUTE_PREFIX = 'routePrefix',
  JWT_ALGORITHM = 'jwtAlgorithm',
  JWT_SECRET = 'jwtSecret',
  JWT_LIFESPAN = 'jwtLifespan',
  REFRESH_LIFESPAN = 'refreshLifespan',
  DB_TYPE = 'dbType',
  POSTGRES_HOST = 'dbHost',
  POSTGRES_PORT = 'dbPort',
  POSTGRES_DB = 'dbName',
  POSTGRES_USER = 'dbUser',
  POSTGRES_PASSWORD = 'dbPassword',
  LOG_LEVEL = 'logLevel',
  NATS_URI = 'natsUri',
  HEMERA_TIMEOUT = 'hemeraTimeout',
}

export interface ProcessEnv {
  ENV: string;
  API_VERSION: string;
  SERVER_PORT: string;
  ROUTE_PREFIX: string;
  JWT_ALGORITHM: string;
  JWT_SECRET: string;
  JWT_LIFESPAN: string;
  REFRESH_LIFESPAN: string;
  DB_TYPE: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  LOG_LEVEL: string;
}

export enum Environments {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOC = 'loc',
  DEV = 'dev',
  PROD = 'prod',
}

type EnvVarName = keyof typeof EnvVars;
type ServiceConfigValue = string;

export type ExpectedEnvVars<ValueType = EnvVarName> = {
  [key in EnvVars]: ValueType;
};

export type ServerConfig = ExpectedEnvVars<ServiceConfigValue>;

export interface AppConfig extends Omit<ServerConfig, ''> {
  environment: Environments;
  jwtAlgorithm: jwt.Algorithm;
}

export type IDecoratedRequest<P = {}, Q = {}, C = {}, H = {}, R = {}> = {
  payload: P;
  query: Q;
  auth: {
    credentials: C;
  };
  headers: H;
  params: R;
} & Hapi.Request;

export type IToolKit = Hapi.ResponseToolkit;
