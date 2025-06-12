import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const existingCategory = await this.categoryService.findByName(
      createProductDto.categoryName,
    );

    const productData = {
      ...createProductDto,
      category: existingCategory,
    };

    const createdProduct = await new this.productModel(productData).populate(
      'supplier',
      'username',
    );

    createdProduct.save();

    return createdProduct;
  }

  async findAll(): Promise<ProductDocument[]> {
    const result = await this.productModel
      .find()
      .populate('supplier', 'username')
      .populate('category', 'name')
      .exec();

    return result;
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('supplier', 'id username email')
      .populate('category', 'name')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryName) {
      const category = await this.categoryService.findByName(
        updateProductDto.categoryName,
      );
      product.category = category;
    }

    product.set(updateProductDto);
    await product.save();

    return product;
  }

  async remove(id: string): Promise<ProductDocument> {
    const currentProduct = await this.findOne(id);
    await currentProduct.deleteOne();
    return currentProduct;
  }
}
