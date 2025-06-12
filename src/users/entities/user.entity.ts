import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { EUserRole } from '../enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
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

  @Prop({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplier',
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
