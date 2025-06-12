import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { EUserRole } from 'src/users/enums/user.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { BaseResponse } from 'src/common/interfaces/responses.interface';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';
import { isUndefined } from 'util';

@UseGuards(AuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(EUserRole.SUPPLIER, EUserRole.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<BaseResponse<ProductDocument>> {
    createProductDto.supplier = currentUser._id.toString();

    const createdProduct = await this.productsService.create(createProductDto);
    return BaseResponseHandler.create(
      HttpStatus.CREATED,
      'Product created successfully',
      createdProduct,
    );
  }

  @Get()
  @Public()
  async findAll(): Promise<BaseResponse<ProductDocument[]>> {
    const products = await this.productsService.findAll();
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Products retrieved successfully',
      products,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponse<ProductDocument>> {
    const product = await this.productsService.findOne(id);
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Product retrieved successfully',
      product,
    );
  }

  @Patch(':id')
  @Roles(EUserRole.SUPPLIER, EUserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<BaseResponse<ProductDocument>> {
    const currentProduct = await this.productsService.findOne(id);

    if (
      currentUser.role !== EUserRole.ADMIN &&
      currentUser._id.toString() !== currentProduct.supplier._id.toString()
    ) {
      throw new ForbiddenException('Unauthorized');
    }
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Product updated successfully',
      updatedProduct,
    );
  }

  @Delete(':id')
  @Roles(EUserRole.SUPPLIER, EUserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<BaseResponse<ProductDocument>> {
    const currentProduct = await this.productsService.findOne(id);

    if (
      currentUser.role !== EUserRole.ADMIN &&
      currentUser._id.toString() !== currentProduct.supplier._id.toString()
    ) {
      throw new ForbiddenException('Unauthorized');
    }

    const deletedProduct = await this.productsService.remove(id);

    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Product deleted successfully',
      deletedProduct,
    );
  }
}
