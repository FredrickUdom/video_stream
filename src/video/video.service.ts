import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm';
import { VideoDto } from './video.dto';
import { VideoEntity } from './video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  // by-id
  // update
  // get all user
  async getAllVideos(q?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};
    if (q) {
      options = {
        name: ILike(`%${q}%`),
      };
    }
    return await this.videoRepository.find({
      where: {
        ...options,
        isPublic: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getMostPopularVideo() {
    return this.videoRepository.find({
      where: { views: MoreThan(0) },
      relations: { user: true },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscribersCount: true,
        },
      },
      order: {
        createdAt: -1,
      },
    });
  }

  async byId(id: number, isPublic = false) {
    const user = await this.videoRepository.findOne({
      where: isPublic ? { id: id, isPublic: true } : { id },
      relations: { comments: true },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscribersCount: true,
        },
        comments: {
          id: true,
          message: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscribersCount: true,
          },
        },
      },
    });
    console.log(user);
    if (!user) throw new NotFoundException('video not found');
    return user;
  }

  async update(id: number, dto: VideoDto) {
    const video = await this.byId(id);
    return await this.videoRepository.save({ ...video, ...dto });
  }

  async create(userId: number) {
    const defaultValue = {
      name: '',
      user: { id: userId },
      videoPath: '',
      description: '',
      thumbnailPath: '',
    };
    const newVideo = this.videoRepository.create(defaultValue);
    const video = await this.videoRepository.save(newVideo);
    return video;
  }

  async delete(id: number) {
    return this.videoRepository.delete({ id });
  }

  async updateViewCount(id: number) {
    const video = await this.byId(id);
    video.views++;
    return await this.videoRepository.save(video);
  }

  async updateReaction(id: number, type: string) {
    const video = await this.byId(id);
    if (type == 'like') {
      video.likes++;
    } else {
      video.likes--;
    }
    return await this.videoRepository.save(video);
  }
}
