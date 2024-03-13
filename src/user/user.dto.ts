import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  avatarPath: string;

  password?: string;
}
