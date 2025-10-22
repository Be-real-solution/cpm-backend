import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { CreateAtmoDto } from './dto/create-atmo.dto';
import { UpdateAtmoDto } from './dto/update-atmo.dto';
import { ApiTags } from '@nestjs/swagger';
import { BindCardDto } from './dto/bind-card.dto';
import { ConfirmCardDto } from './dto/confirm-card.dto';

@ApiTags('Atmos')
@Controller('atmos')
export class AtmosController {
  constructor(private readonly atmosService: AtmosService) {}

  @Get('token')
  generateToken() {
    return this.atmosService.generateToken();
  }

  @Post('bind-card')
  bindCard(@Body() body: BindCardDto) {
    return this.atmosService.bindCard(body);
  }

  @Post('confirm-card')
  confirmCard(@Body() body: ConfirmCardDto) {
    return this.atmosService.confirmCard(body.transactionId, body.otp);
  }
}
