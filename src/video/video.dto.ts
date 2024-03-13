import { IsString } from 'class-validator';

export class VideoDto {
  @IsString()
  description: string;

  @IsString()
  name: string;

  @IsString()
  videoPath: string;

  @IsString()
  thumbnailPath: string;

  isPublic?: boolean;
}
