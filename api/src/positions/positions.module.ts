import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuditLogModule } from 'src/audit-log/audit-log.module';


@Module({
  imports: [DatabaseModule, AuditLogModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}