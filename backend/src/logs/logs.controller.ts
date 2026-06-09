import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }

  @Get()
  findAll(@Query('usuarioId') usuarioId?: number) {
    // Solo enviamos el usuarioId, borramos el modulo
    return this.logsService.findAll(usuarioId); 
  }
}
