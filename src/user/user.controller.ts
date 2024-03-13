import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../auth/decarator/auth.decarator';
import { CurrentUser } from './user.decorator';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return await this.userService.byId(id);
  }
  @Get('by-id/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.byId(Number(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateUser(@Body() dto: UserDto, @Param('id') id: number) {
    const returnedValue = await this.userService.updateProfile(Number(id), dto);
    return returnedValue;
  }

  @HttpCode(200)
  @Patch('subscribe/:channelId')
  @Auth()
  async subscribeToCahnnel(
    @CurrentUser('id') id: number,
    @Param('channelId') channelId: number,
  ) {
    const returnedValue = await this.userService.subscribe(
      Number(id),
      Number(channelId),
    );
    return returnedValue;
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
