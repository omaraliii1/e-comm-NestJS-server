import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { ProductsService } from 'src/products/products.service';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<CartDocument> {
    const newCart = new this.cartModel(createCartDto);
    return await newCart.save();
  }

  async deleteCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOneAndDelete({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addProductToCart(
    currentUser: IUser,
    productId: string,
  ): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({
      user: currentUser._id.toString(),
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');

    cart.products.push(product._id);
    cart.totalPrice += product.price;
    cart.quantities = cart.products.length;

    await cart.save();
    return cart.populate('products');
  }

  async deleteProductFromCart(
    currentUser: IUser,
    productId: string,
  ): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({
      user: currentUser._id.toString(),
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');

    const index = cart.products.findIndex(
      (id) => id.toString() === product._id.toString(),
    );

    if (index === -1) throw new NotFoundException('Product not in cart');

    cart.products.splice(index, 1);

    cart.totalPrice -= product.price;
    if (cart.totalPrice < 0) cart.totalPrice = 0;

    cart.quantities = cart.products.length;

    await cart.save();
    return cart.populate('products');
  }

  async listProductsInCart(userId: string, currentUser: IUser) {
    if (userId !== currentUser._id.toString())
      throw new ForbiddenException('UnAuthorized');

    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('products');

    if (!cart) throw new NotFoundException('Cart not found');

    return {
      products: cart.products,
      totalPrice: cart.totalPrice,
    };
  }
}
