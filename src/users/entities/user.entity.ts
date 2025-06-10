import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EUserRole } from '../enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone_number: string;

  @Prop({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
