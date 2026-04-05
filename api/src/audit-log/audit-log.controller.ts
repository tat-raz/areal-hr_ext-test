import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll() {
    return this.auditLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditLogService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditLogService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuditLogDto) {
    return this.auditLogService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditLogService.remove(+id);
  }
}