import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  products: Types.ObjectId[];

  @Prop({ required: true, default: 0 })
  totalPrice: number;

  quantities: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('quantities').get(function () {
  return this.products?.length || 0;
});

CartSchema.set('toObject', { virtuals: true });
CartSchema.set('toJSON', { virtuals: true });
