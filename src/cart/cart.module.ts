import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './entities/cart.entity';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
