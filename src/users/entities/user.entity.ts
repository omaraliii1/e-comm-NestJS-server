import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EUserRole } from '../enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone_number: string;

  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  reviews: Types.ObjectId[];

  @Prop({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
