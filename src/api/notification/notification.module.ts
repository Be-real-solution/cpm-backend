import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity, StoreNotificationEntity } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, StoreNotificationEntity])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
