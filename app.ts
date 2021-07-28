// Hapi
import * as HapiSwagger from 'hapi-swagger';
import * as Hapi from '@hapi/hapi';
import * as HapiBearer from 'hapi-auth-bearer-token';
import * as HapiJWT from 'hapi-auth-jwt2';
import * as Boom from '@hapi/boom';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';

// libs
import Pino from 'pino';
import { constants as StatusCodes } from 'http2';
import * as Status from 'http-status-codes';
import _ from 'lodash';
import { Connection, createConnection } from 'typeorm';

// Other
import routes from './src/routes';
import authService from './src/routes/Auth/strategies';
import { Strategies } from './types/Auth/Strategies/interfaces';
import * as I from './types/common/App';
import * as T from './types/common/types';
import { typeError as TypeError } from './types/common/enums';

class App {
  private logger: Pino.Logger;

  private server: Hapi.Server;

  public config: I.ProcessEnv;

  private error: Boom.Boom;

  private db: Connection;

  // Methods
  public generateHttpError(
    errorData: any,
    data: T.optionsDataErrorGenerator = { typeError: TypeError.baseError }
  ) {
    const {
      statusCode = (errorData.output && errorData.output.statusCode) ||
        StatusCodes.HTTP_STATUS_SERVICE_UNAVAILABLE,
      message = errorData.toString(),
    } = errorData;
    if (data.typeError === TypeError.externalServiceError) {
      const transformError = errorData;
      transformError.output.payload.typeError = data.typeError;
      transformError.output.payload.externalError = data.meta;
      this.error = transformError;
      return this.error;
    }
    this.error = new Boom.Boom(message, { statusCode });
    return this.error;
  }

  private initLogger() {
    const getEnvironmentConfig: () => Pino.LoggerOptions = () => {
      switch (this.config.ENV) {
        case I.Environments.LOC:
          return {
            prettyPrint: { colorize: true },
            level: 'debug',
            redact: {
              paths: ['request.body.file._data'],
              censor: 'too big to show',
            },
          };
        case I.Environments.PROD:
          return { level: this.config.LOG_LEVEL };
        default:
          return {};
      }
    };

    const loggerConfig = getEnvironmentConfig();

    this.logger = Pino(loggerConfig);
  }

  public get log(): Pino.Logger {
    return this.logger;
  }

  public get responseCode() {
    return Status;
  }

  public get serverInstance() {
    return this.server;
  }

  public async stop() {
    return this.server.stop();
  }

  public get params(): I.ProcessEnv {
    return this.config;
  }

  public get connection() {
    return this.db;
  }

  private async initDB() {
    this.db = await createConnection();
  }

  public async startDB(env: any) {
    process.on('unhandledRejection', (err: any) => {
      const logger = this.log || console;
      logger.error(err);
    });

    this.config = {
      ...env,
    };

    try {
      this.initLogger();
      await this.initDB();
      this.log.info('**************Start_DB**************');
    } catch (err) {
      this.log.info('Start_DB: Ошибка!');
      const logger = this.log || console;
      logger.error(err);
    }
  }

  public async start(env: any): Promise<Hapi.Server> {
    process.on('unhandledRejection', (err) => {
      const logger = this.log || console;
      logger.error('unhandledRejection', err);
    });

    this.config = {
      ...env,
    };

    try {
      this.initLogger();
      await this.initServer();
      await this.server.start();
      await this.startDB(env);

      this.log.info(`Сервер запущен успешно!`);
      this.log.info(
        // eslint-disable-next-line max-len
        `Документация к API доступна по адресу: http://${this.server.info.address}:${this.server.info.port}${this.params.ROUTE_PREFIX}/documentation`
      );
    } catch (err) {
      const logger = this.log || console;
      if (this.server) {
        await this.server.stop();
      }
      logger.error(err);
    }

    return this.server;
  }

  private async initServer() {
    this.server = new Hapi.Server({
      port: +this.params.SERVER_PORT,
      routes: {
        cors: {
          origin: ['*'],
          credentials: true,
        },
        validate: {
          failAction: async (request, h, err) => {
            if (err) {
              throw Boom.badRequest(err.message);
            }
          },
          options: {
            abortEarly: false,
          },
        },
      },
    });

    const swaggerOptions = {
      info: {
        title: 'Test API Documentation',
        version: '1.0.0',
      },
    };

    await this.server.register([
      {
        plugin: HapiBearer,
      },
      {
        plugin: HapiJWT,
      },
      {
        plugin: Inert,
      },
      {
        plugin: Vision,
      },
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);

    if (this.config.ENV !== I.Environments.PROD) {
      await this.server.register({
        plugin: HapiSwagger,
        options: <HapiSwagger.RegisterOptions>{
          info: {
            title: 'Intersip-Backend',
            description: 'JSON REST API Intership-Backend',
            version: this.params.API_VERSION,
          },
          grouping: 'tags',
          tagsGroupingFilter: (tag) =>
            !['api', this.params.API_VERSION].includes(tag),
          schemes: [this.params.ENV === I.Environments.LOC ? 'http' : 'https'],
          documentationPath: `${this.params.ROUTE_PREFIX}/documentation`,
          jsonPath: `${this.params.ROUTE_PREFIX}/swagger.json`,
          swaggerUIPath: `${this.params.ROUTE_PREFIX}/swaggerui`,
          securityDefinitions: {
            Bearer: {
              type: 'apiKey',
              name: 'Authorization',
              description: 'Bearer token',
              in: 'header',
            },
          },
          security: [{ Bearer: [] }],
        },
      });
    }

    const auth = authService({
      [I.EnvVars.JWT_SECRET]: this.params.JWT_SECRET,
      [I.EnvVars.JWT_LIFESPAN]: this.params.JWT_LIFESPAN,
      [I.EnvVars.JWT_ALGORITHM]: this.params.JWT_ALGORITHM,
      [I.EnvVars.REFRESH_LIFESPAN]: this.params.REFRESH_LIFESPAN,
    });
    this.server.auth.strategy(Strategies.static, 'bearer-access-token', {
      validate: auth[Strategies.static],
    });

    this.server.events.on('response', (request) => {
      const {
        info: { remoteAddress },
      } = request;
      const response = <Hapi.ResponseObject>request.response;
      const isSwagger = request.path.includes('/swagger');
      if (isSwagger) return true;
      const isDocumentation = request.path.includes('/documentation');
      this.log.info({
        request: {
          from: remoteAddress,
          to: `${request.method.toUpperCase()} ${request.path}`,
          headers: request.headers,
          body: request.payload,
        },
        response: {
          body: isDocumentation ? 'documentation' : 'response',
          statusCode:
            !_.isEmpty(response) && _.has(response, 'statusCode')
              ? response.statusCode
              : response,
        },
      });
      return true;
    });

    if (this.params.ROUTE_PREFIX !== '/')
      this.server.realm.modifiers.route.prefix = this.params.ROUTE_PREFIX;

    this.server.route(routes);
  }
}

export default new App();
