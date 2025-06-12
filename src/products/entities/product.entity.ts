import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
// @IsUrl should NOT be imported or used here as it's for DTOs, not Mongoose entities.
// import { IsUrl } from 'class-validator';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  supplier: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
