import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IJwtPayload } from '../interfaces/jwtpayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) return false;

    try {
      const decoded = this.jwtService.verify(token) as IJwtPayload;
      const user = await this.usersService.findById(decoded.id);

      if (!user) return false;

      request.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
