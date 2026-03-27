import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import {
  CreateUserDto,
  UpdateSelfUserDto,
  UpdateUserDto,
} from './dto/user.dto';
import { hashingPassword } from 'src/common/utils/hashing';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { username, email, password } = createUserDto;

    const existingUsername = await this.findByUsername(username, false);
    if (existingUsername) {
      throw new ConflictException(`Username ${username} already exists`);
    }

    const existingEmail = await this.findByEmail(email, false);
    if (existingEmail) {
      throw new ConflictException(`Email ${email} already exists`);
    }

    const hashedPassword = await hashingPassword(password);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await user.save();

    return user;
  }

  async findAllUsers(): Promise<UserDocument[]> {
    const users = this.userModel.find().select('username email role').exec();
    return users;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .select('username email role')
      .populate('products')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(
    email: string,
    throwError: boolean = true,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ email: { $regex: `^${email}$`, $options: 'i' } })
      .exec();

    if (!user && throwError) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByUsername(
    username: string,
    throwError: boolean = true,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ username: { $regex: `^${username}$`, $options: 'i' } })
      .exec();

    if (!user && throwError) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async updateSelfUser(
    userId: string,
    updateSelfUserDto: UpdateSelfUserDto,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);

    if (updateSelfUserDto.username != user.username) {
      const existingUsername = await this.findByUsername(
        updateSelfUserDto.username,
        false,
      );
      if (existingUsername) {
        throw new ConflictException(
          `Username ${updateSelfUserDto.username} already exists`,
        );
      }
    }

    if (updateSelfUserDto.email != user.email) {
      const existingEmail = await this.findByEmail(
        updateSelfUserDto.email,
        false,
      );
      if (existingEmail) {
        throw new ConflictException(
          `Email ${updateSelfUserDto.email} already exists`,
        );
      }
    }
    const hashedPassword = await hashingPassword(updateSelfUserDto.password);

    updateSelfUserDto.password = hashedPassword;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateSelfUserDto, { new: true })
      .exec();

    return updatedUser;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
    await this.cartService.deleteCart(result._id.toString());
    return { message: 'User deleted successfully' };
  }
}
