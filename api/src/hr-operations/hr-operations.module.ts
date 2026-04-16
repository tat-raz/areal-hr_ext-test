import { Module } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { HrOperationsController } from './hr-operations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuditLogModule } from 'src/audit-log/audit-log.module';


@Module({
  imports: [DatabaseModule, AuditLogModule],
  controllers: [HrOperationsController],
  providers: [HrOperationsService],
})
export class HrOperationsModule {}
