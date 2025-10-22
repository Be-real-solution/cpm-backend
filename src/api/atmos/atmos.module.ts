import { Module } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { AtmosController } from './atmos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtmosEntity } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([AtmosEntity])],
  controllers: [AtmosController],
  providers: [AtmosService],
})
export class AtmosModule {}
