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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';
import { BaseResponse } from 'src/common/interfaces/responses.interface';
import { Category } from './entities/category.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EUserRole } from 'src/users/enums/user.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('categories')
@UseGuards(AuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(EUserRole.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<BaseResponse<Category>> {
    const createdCategory =
      await this.categoriesService.create(createCategoryDto);
    return BaseResponseHandler.create(
      HttpStatus.CREATED,
      'Category created successfully',
      createdCategory,
    );
  }

  @Get()
  @Roles(EUserRole.ADMIN, EUserRole.SUPPLIER, EUserRole.USER)
  async findAll(): Promise<BaseResponse<Category[]>> {
    const categories = await this.categoriesService.findAll();
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Categories retrieved successfully',
      categories,
    );
  }

  @Get('categoryName/:id')
  @Roles(EUserRole.ADMIN)
  async findByName(@Param('id') id: string): Promise<BaseResponse<Category>> {
    const result = await this.categoriesService.findByName(id, false);
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Category retrieved successfully',
      result,
    );
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<BaseResponse<Category>> {
    const category = await this.categoriesService.findOne(id);
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Category retrieved successfully',
      category,
    );
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<BaseResponse<Category>> {
    const updatedCategory = await this.categoriesService.update(
      id,
      updateCategoryDto,
    );
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Category updated successfully',
      updatedCategory,
    );
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<BaseResponse<Category>> {
    const deletedCategory = await this.categoriesService.remove(id);
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Category deleted successfully',
      deletedCategory,
    );
  }
}
