import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUser } from 'src/users/interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof IUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data) {
      return user[data];
    }
    return user;
  },
);
