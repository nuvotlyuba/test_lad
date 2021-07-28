import { ConnectionOptions } from 'typeorm';
import { Environments } from './types/common/App';

export = {
  type: String(process.env.DB_TYPE),
  host: String(process.env.POSTGRES_HOST),
  port: Number(process.env.POSTGRES_PORT),
  username: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
  database: String(process.env.POSTGRES_DB),
  synchronize: false,
  cache: false,
  entities: ['data_base/entities/**/*.ts'],
  migrations: ['data_base/migrations/**/*.ts'],
  migrationsRun: [Environments.LOC].includes(
    String(process.env.ENV) as Environments
  ),
  cli: {
    entitiesDir: 'data_base/entities',
    migrationsDir: 'data_base/migrations',
    subscribersDir: 'data_base/subscriber',
  },
  logging: 'all'
} as ConnectionOptions;
