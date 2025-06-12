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
    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID "${createReviewDto.productId}" not found.`,
      );
    }

    const reviewData = {
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      product: productId,
      user: userId,
    };

    const createdReview = await new this.reviewModel(reviewData).save();
    const user = await this.usersService.findById(userId.toString());

    user.reviews.push(createdReview._id);

    await user.save();

    // console.log(user.reviews);
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
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException('No reviews found.');
    }
    return reviews;
  }
}
