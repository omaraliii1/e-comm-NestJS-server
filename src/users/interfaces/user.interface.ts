import { Types } from 'mongoose';
import { EUserRole } from '../enums/user.enum';

export interface IUser {
  _id: Types.ObjectId;
  username: string;

  email: string;

  phone_number: string;

  role: EUserRole;
}
