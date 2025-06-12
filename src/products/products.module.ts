import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './entities/product.entity';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import {
  Category,
  CategorySchema,
} from '../categories/entities/category.entity';
import { CategoriesModule } from 'src/categories/categories.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

    UsersModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [
    ProductsService,

    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
})
export class ProductsModule {}
