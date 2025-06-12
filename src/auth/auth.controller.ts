import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return BaseResponseHandler.create(200, 'Login successful', result);
  }

  @Public()
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.create(createUserDto);

    return BaseResponseHandler.create(201, 'User created successfully', user);
  }
}
