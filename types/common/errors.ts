import { constants as StatusCodes } from 'http2';
import Boom from '@hapi/boom';

export namespace I {
  export interface SystemError {
    statusCode: number;
    message: string;
  }

  export interface ExternalServiceError {
    serviceName: string;
    humanReadableMessage: string;
    originalMessage: string;
  }
}

export class SystemError extends Error {
  readonly statusCode: number;

  readonly message: string;

  constructor({ message, statusCode }: I.SystemError) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class BadRequestError extends Boom.Boom {
  constructor(message: string) {
    super(message, { statusCode: StatusCodes.HTTP_STATUS_BAD_REQUEST });
  }
}

export class AccessDeniedError extends Boom.Boom {
  constructor(message) {
    super(message, { statusCode: StatusCodes.HTTP_STATUS_FORBIDDEN });
  }
}

export class UnauthorizedError extends Boom.Boom {
  constructor(message) {
    super(message, { statusCode: StatusCodes.HTTP_STATUS_UNAUTHORIZED });
  }
}

export class NotFoundError extends Boom.Boom {
  constructor(message) {
    super(message, { statusCode: StatusCodes.HTTP_STATUS_NOT_FOUND });
  }
}

export class InternalServerError extends Boom.Boom {
  constructor(message) {
    super(message, {
      statusCode: StatusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

export class ExternalServiceError extends SystemError {
  constructor(error: I.ExternalServiceError) {
    const { serviceName, originalMessage, humanReadableMessage } = error;
    const message = `Сервис "${serviceName}" недоступен. ${humanReadableMessage}. Ошибка сервиса: ${originalMessage}`;
    const statusCode = StatusCodes.HTTP_STATUS_MISDIRECTED_REQUEST;
    super({ message, statusCode });
  }
}

export type boom = Boom.Boom;
