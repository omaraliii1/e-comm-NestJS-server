import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { CreateReviewDto } from './dto/review.dto';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly productService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: Types.ObjectId,
  ): Promise<ReviewDocument> {
    const productId = createReviewDto.productId;

    const existingProduct = await this.productService.findOne(
      productId.toString(),
    );

    const reviewData = {
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      product: existingProduct._id,
      user: userId,
    };

    const createdReview = await new this.reviewModel(reviewData).save();

    return createdReview.populate('user', 'email');
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const currentReview = await this.reviewModel.findById(id).exec();
    if (!currentReview) {
      throw new NotFoundException(`Review with ID "${id}" not found.`);
    }

    return currentReview;
  }

  async remove(id: string): Promise<ReviewDocument> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deletedReview) {
      throw new NotFoundException(`Review with ID "${id}" not found.`);
    }
    return deletedReview;
  }

  async findAll(): Promise<ReviewDocument[]> {
    const reviews = await this.reviewModel
      .find()
      .populate('user', 'username email')
      .exec();
    return reviews;
  }
}
