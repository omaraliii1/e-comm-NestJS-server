import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    const categoryExists = await this.findByName(createCategoryDto.name, false);
    if (categoryExists) {
      throw new NotFoundException(
        `Category with name "${createCategoryDto.name}" already exists.`,
      );
    }
    const createdCategory = new this.categoryModel(createCategoryDto);
    await createdCategory.save();
    return createdCategory;
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findById(id)
      .populate('products')
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found.`);
    }
    return category;
  }

  async findByName(
    name: string,
    throwError: boolean = true,
  ): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findOne({ name: { $regex: `^${name}$`, $options: 'i' } })
      .exec();

    if (!category && throwError) {
      throw new NotFoundException(`Category with ID "${name}" not found.`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && category.name !== updateCategoryDto.name) {
      const existingCategory = await this.findByName(
        updateCategoryDto.name,
        false,
      );
      if (existingCategory && !existingCategory._id.equals(category._id)) {
        throw new NotFoundException(
          `Category with name "${updateCategoryDto.name}" already exists.`,
        );
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(category._id, updateCategoryDto, { new: true })
      .exec();
    return updatedCategory;
  }

  async remove(id: string): Promise<CategoryDocument> {
    const category = await this.findOne(id);

    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(category._id)
      .exec();

    return deletedCategory;
  }
}
