import { IDecoratedRequest } from '../../../types/common/App';
import * as T from '../../../types/Auth/Controllers';
import app from '../../../app';
import AuthRepository from '../../repositories/database/Auth';
import { boom } from '../../../types/common/errors';

export const controllers = {
  test: async (request, h) => {
    try {
      return 'It is test route!!!';
    } catch (e) {
      return console.log(e);
    }
  },
  authUser: async (
    request: IDecoratedRequest,
    token: string
  ): Promise<T.authObjectResponse | any> => {
    try {
      return await AuthRepository.auth.request({ token });
    } catch (e) {
      app.log.error(e);
      return app.generateHttpError(e);
    }
  },
  loginUser: async (
    request: IDecoratedRequest<T.loginUserPayload>
  ): Promise<any | boom> => {
    try {
      const { payload } = request;
      const response = await AuthRepository.loginUser.request(payload);
      return response;
    } catch (e) {
      app.log.error(e);
      return app.generateHttpError(e);
    }
  },
  registrationUser: async (
    request: IDecoratedRequest<T.loginUserPayload>
  ): Promise<any | boom> => {
    try {
      const { payload } = request;
      const response = await AuthRepository.registrationUser.request(payload);
      return response;
    } catch (e) {
      app.log.error(e);
      return app.generateHttpError(e);
    }
  },
};
