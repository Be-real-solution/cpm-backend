import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientCardService } from './client-card.service';
import { CreateClientCardDto } from './dto/create-client-card.dto';
import { UpdateClientCardDto } from './dto/update-client-card.dto';

@Controller('client-card')
export class ClientCardController {
  constructor(private readonly clientCardService: ClientCardService) {}
}
