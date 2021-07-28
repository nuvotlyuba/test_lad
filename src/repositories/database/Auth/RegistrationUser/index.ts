import bcrypt from 'bcrypt';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../../types/common/errors';
import app from '../../../../../app';
import User from '../../../../../data_base/entities/User';

export default class Repository {
  static async request(params: any): Promise<any> {
    const { login, password } = params;

    const userRepo = app.connection.getRepository(User);
    const userFind = await userRepo.findOne({ where: { login } });

    if (userFind) {
      throw new NotFoundError('Данный пользователь уже есть в базе данных');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordToSave: any = bcrypt.hashSync(password, salt);

    const userCreate = await userRepo.save({ login, password: passwordToSave });

    if (!userCreate) {
      throw new BadRequestError('Не удалось сохранить пользователя');
    }

    return {
      statusCode: app.responseCode.StatusCodes.OK,
      massage: app.responseCode.ReasonPhrases.OK,
    };
  }
}
