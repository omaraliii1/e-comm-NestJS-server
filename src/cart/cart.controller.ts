import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { EUserRole } from 'src/users/enums/user.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':id')
  @Roles(EUserRole.USER, EUserRole.ADMIN, EUserRole.SUPPLIER)
  async addProduct(
    @Param('id') productId: string,
    @CurrentUser() currentUser: IUser,
  ) {
    const updatedCart = await this.cartService.addProductToCart(
      currentUser,
      productId,
    );

    return BaseResponseHandler.create(
      200,
      'Product added to cart',
      updatedCart,
    );
  }

  @Delete(':id')
  @Roles(EUserRole.USER, EUserRole.ADMIN, EUserRole.SUPPLIER)
  async deleteProduct(
    @Param('id') productId: string,
    @CurrentUser() currentUser: IUser,
  ) {
    const updatedCart = await this.cartService.deleteProductFromCart(
      currentUser,
      productId,
    );

    return BaseResponseHandler.create(
      200,
      'Product removed from cart',
      updatedCart,
    );
  }

  @Get(':id')
  @Roles(EUserRole.USER, EUserRole.ADMIN, EUserRole.SUPPLIER)
  async getProducts(
    @Param('id') userId: string,
    @CurrentUser() currentUser: IUser,
  ) {
    const products = await this.cartService.listProductsInCart(
      userId,
      currentUser,
    );
    return BaseResponseHandler.create(
      200,
      'Products fetched successfully',
      products,
    );
  }
}
