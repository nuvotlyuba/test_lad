import app from '../../../../../app';
import Session from '../../../../../data_base/entities/Session';

export default class AuthRepository {
  static async request(params: any): Promise<any> {
    const { token } = params;
    const sessionRepo = app.connection.getRepository(Session);

    const sessionFind = await sessionRepo.findOne({
      where: { token },
      relations: ['user'],
      order: { created: 'DESC' },
    });
    if (!sessionFind) {
      return {
        isValid: false,
        credentials: {
          token: '',
          user: {},
        },
      };
    }
    return {
      isValid: true,
      credentials: {
        token,
        user: {
          id: sessionFind.user.id,
        },
      },
    };
  }
}
