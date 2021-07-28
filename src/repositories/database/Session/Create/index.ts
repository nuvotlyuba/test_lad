import { v4 as uuidv4 } from 'uuid';
import app from '../../../../../app';
import Session from '../../../../../data_base/entities/Session';
import { NotFoundError } from '../../../../../types/common/errors';

export default class SessionsRepository {
  static async request(params: any): Promise<any> {
    const { userId } = params;
    const sessionRepo = app.connection.getRepository(Session);
    const tokenGenerate = uuidv4();
    const sessionCreate = await sessionRepo.save({
      user: userId,
      token: tokenGenerate,
    });
    if (!sessionCreate) {
      throw new NotFoundError('Не удалось создать сессию');
    }
    return { token: sessionCreate.token };
  }
}
