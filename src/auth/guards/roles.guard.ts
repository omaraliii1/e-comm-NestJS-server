import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { EUserRole } from 'src/users/enums/user.enum';
import { IAuthenticatedRequest } from 'src/common/interfaces/authenticatedUser.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest() as IAuthenticatedRequest;
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException(
        'Access denied: User role not found or not authenticated.',
      );
    }

    if (user.role === EUserRole.ADMIN) {
      return true;
    }

    const hasPermission = requiredRoles.some((role) => user.role === role);

    if (!hasPermission) {
      throw new ForbiddenException(
        'Access denied: Insufficient role permissions.',
      );
    }

    return true;
  }
}
