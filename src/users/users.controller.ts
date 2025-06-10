import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAllUsers();
    return BaseResponseHandler.create(
      200,
      'Users retrieved successfully',
      users,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return BaseResponseHandler.create(200, 'User retrieved successfully', user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return BaseResponseHandler.create(
      200,
      'User updated successfully',
      updatedUser,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return BaseResponseHandler.create(200, 'User deleted successfully', result);
  }
}
