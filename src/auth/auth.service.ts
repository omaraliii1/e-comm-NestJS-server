import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { compareHashed, hashingPassword } from 'src/common/utils/hashing';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { loggedInUserResponse } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { username, email, password } = createUserDto;

    const existingUsername = await this.userService.findByUsername(
      username,
      false,
    );
    if (existingUsername) {
      throw new ConflictException(`Username ${username} already exists`);
    }

    const existingEmail = await this.userService.findByEmail(email, false);
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
