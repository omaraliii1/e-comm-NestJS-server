import { EUserRole } from 'src/users/enums/user.enum';
import { Request } from 'express';

export interface IAuthenticatedRequest extends Request {
  user: {
    _id: string;
    role: EUserRole;
  };
}
