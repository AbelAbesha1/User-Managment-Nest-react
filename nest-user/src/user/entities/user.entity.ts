import { User as UserModel } from '@prisma/client';

export class UserEntity implements UserModel {
  id: string;
  userId: string;
  email: string;
  name: string;
  password: string;
  phone: string;
}
