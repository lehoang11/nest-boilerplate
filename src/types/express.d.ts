import { AdminUser } from '../common/entities/admin-user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
