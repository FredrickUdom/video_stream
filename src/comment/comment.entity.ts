import { UserEntity } from 'src/user/user.entity';
import { Base } from 'src/utils/base';
import { VideoEntity } from 'src/video/video.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Comment')
export class CommentEntity extends Base {
  @Column({ default: '' })
  message: string;

  @ManyToOne(() => VideoEntity, (video) => video.comments)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
