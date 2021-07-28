import * as I from '../../../types/Auth/Strategies/interfaces';
import { controllers } from '../../controllers/Auth';

const authService: I.AuthService = () => ({
  [I.Strategies.static]: async (request, token) => {
    return controllers.authUser(request, token);
  },
});

export default authService;
