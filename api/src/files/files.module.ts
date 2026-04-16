import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuditLogModule } from 'src/audit-log/audit-log.module';


@Module({
  imports: [DatabaseModule, AuditLogModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
