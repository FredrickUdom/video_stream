import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './subscriptions.entity';
import { UserDto } from './user.dto';
import { genSalt, hash } from 'bcryptjs';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionEntity>,
  ) {}

  // by-id
  // update
  // get all user
  async getAllUsers() {
    return await this.userRepository.find();
  }

  async subscribe(id: number, channelId: number) {
    const data = {
      toChannel: { id: channelId },
      fromUser: { id },
    };
    const isSubscribed = await this.subscriptionsRepository.findOneBy(data);
    if (!isSubscribed) {
      const newSubscription = await this.subscriptionsRepository.create(data);
      console.log(newSubscription);
      await this.subscriptionsRepository.save(newSubscription);
      return true;
    }
    await this.subscriptionsRepository.delete(data);
    return false;
  }

  async updateProfile(id: number, dto: UserDto) {
    const user = await this.byId(id);
    const isSameUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (isSameUser && id !== isSameUser.id)
      throw new BadRequestException('User already registered');
    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    user.email = dto.email;
    user.name = dto.name;
    user.description = dto.description;
    user.avatarPath = dto.avatarPath;
    return this.userRepository.save(user);
  }

  async byId(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: {
        videos: true,
        subscriptions: {
          toChannel: true,
        },
      },
    });
    console.log(user);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
}
