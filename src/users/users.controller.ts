import {
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateSelfUserDto, UpdateUserDto } from './dto/user.dto';
import { BaseResponseHandler } from 'src/common/utils/baseResponseHandler';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EUserRole } from './enums/user.enum';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { IUser } from './interfaces/user.interface';

@Controller('/api/users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(EUserRole.ADMIN)
  async findAll() {
    const users = await this.userService.findAllUsers();
    return BaseResponseHandler.create(
      200,
      'Users retrieved successfully',
      users,
    );
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return BaseResponseHandler.create(200, 'User retrieved successfully', user);
  }

  @Patch('me')
  async updateSelf(
    @Body() UpdateSelfUserDto: UpdateSelfUserDto,
    @CurrentUser() currentUser: IUser,
  ) {
    const updatedUser = await this.userService.updateUser(
      currentUser._id.toString(),
      UpdateSelfUserDto,
    );
    return BaseResponseHandler.create(
      200,
      'User updated successfully',
      updatedUser,
    );
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return BaseResponseHandler.create(
      200,
      'User updated successfully',
      updatedUser,
    );
  }

  @Delete('me')
  async deleteSelf(@CurrentUser() currentUser: IUser) {
    const result = await this.userService.remove(currentUser._id.toString());
    return BaseResponseHandler.create(200, 'User deleted successfully', result);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return BaseResponseHandler.create(200, 'User deleted successfully', result);
  }
}
