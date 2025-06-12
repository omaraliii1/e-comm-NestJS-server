import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  ForbiddenException,
  Get,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';
import { BaseResponse } from 'src/common/interfaces/responses.interface';
import { Review, ReviewDocument } from './entities/review.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { EUserRole } from 'src/users/enums/user.enum';
import { IUser } from 'src/users/interfaces/user.interface';

@Controller('reviews')
@UseGuards(AuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(EUserRole.USER, EUserRole.ADMIN)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<BaseResponse<Review>> {
    const createdReview = await this.reviewsService.create(
      createReviewDto,
      currentUser._id,
    );
    return BaseResponseHandler.create(
      HttpStatus.CREATED,
      'Review submitted successfully',
      createdReview,
    );
  }

  @Delete(':id')
  @Roles(EUserRole.USER, EUserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<BaseResponse<Review>> {
    const existingReview = await this.reviewsService.findOne(id);

    if (
      existingReview.user.toString() !== currentUser._id.toString() &&
      currentUser.role !== EUserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this review.',
      );
    }

    const deletedReview = await this.reviewsService.remove(id);
    return BaseResponseHandler.create(
      HttpStatus.OK,
      'Review deleted successfully',
      deletedReview,
    );
  }

  // @Get()
  // @Roles(EUserRole.USER, EUserRole.SUPPLIER, EUserRole.ADMIN)
  // async findAll(): Promise<BaseResponse<Review[]>> {
  //   const reviews = await this.reviewsService.findAll();
  //   return BaseResponseHandler.create(
  //     HttpStatus.OK,
  //     'Reviews retrieved successfully',
  //     reviews,
  //   );
  // }
}
