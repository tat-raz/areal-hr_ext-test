import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';


@Controller('hr-operations')
// @UseGuards(AuthenticatedGuard, RolesGuard)
// @Roles('admin', 'hr_manager')
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) {}

  @Get()
  findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateHrOperationDto) {
    return this.hrOperationsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHrOperationDto,
  ) {
    return this.hrOperationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.remove(id);
  }
}