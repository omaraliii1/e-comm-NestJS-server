import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { compareHashed, hashingPassword } from 'src/common/utils/hashing';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/entities/user.entity';
import { loggedInUserResponse } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cartService: CartService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = await this.userService.create(createUserDto);
    const cart = await this.cartService.create({
      user: createdUser._id.toString(),
    });

    createdUser.cart = cart._id;
    await createdUser.save();

    return createdUser.populate('cart');
  }

  async login(loginDto: LoginDto): Promise<loggedInUserResponse> {
    const user = await this.userService.findByUsername(
      loginDto.username,
      false,
    );
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }

    const isPasswordValid = await compareHashed(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ConflictException('Invalid credentials');
    }
    const token = this.jwtService.sign({
      id: user._id,
    });

    const loggedInUser = {
      auth_token: token,
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return loggedInUser;
  }
}
