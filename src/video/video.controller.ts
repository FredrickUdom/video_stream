import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decarator/auth.decarator';
import { CurrentUser } from 'src/user/user.decorator';
import { VideoDto } from './video.dto';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}
  @Get('get-private/:id')
  @Auth()
  async getVideoPrivate(@Param('id') id: number) {
    return await this.videoService.byId(+id);
  }
  @Get()
  async getAll(@Query('q') q: string) {
    return await this.videoService.getAllVideos(q);
  }
  @Get('most-popular')
  async getMostPopularVideo() {
    return await this.videoService.getMostPopularVideo();
  }

  @Get(':id')
  async geVideo(@Param('id') id: number) {
    return await this.videoService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createVideo(@CurrentUser('id') id: number) {
    const returnedValue = await this.videoService.create(Number(id));
    return returnedValue;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    return await this.videoService.update(Number(id), dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteVideo(@Param('id') id: string) {
    return await this.videoService.delete(Number(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-views/:id')
  @Auth()
  async updateViewCount(@Param('id') id: string) {
    return await this.videoService.updateViewCount(Number(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-likes/:id')
  @Auth()
  async updateReaction(@Param('id') id: string, @Query('type') type: string) {
    return await this.videoService.updateReaction(Number(id), type);
  }
}
