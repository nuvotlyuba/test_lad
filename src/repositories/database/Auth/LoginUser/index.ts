import bcrypt from 'bcrypt';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../../types/common/errors';
import app from '../../../../../app';
import User from '../../../../../data_base/entities/User';

import SessionRepository from '../../Session';

export default class Repository {
  static async request(params: any): Promise<any> {
    const { login, password } = params;

    const userRepo = app.connection.getRepository(User);

    const userFind = await userRepo.findOne({
      where: { login },
      select: ['login', 'password', 'id'],
    });

    if (!userFind) {
      throw new BadRequestError('Пользователь с таким логином найден');
    }
    const checkPassword = await bcrypt.compare(password, userFind.password);
    if (!checkPassword) {
      throw new BadRequestError('Пароль не верный ');
    }
    const session = await SessionRepository.create.request({
      userId: userFind.id,
    });
    const { token } = session;
    return { token };
  }
}
