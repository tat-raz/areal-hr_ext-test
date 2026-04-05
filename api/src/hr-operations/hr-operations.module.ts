import { Module } from '@nestjs/common';
import { HrOperationsService } from './hr-operations.service';
import { HrOperationsController } from './hr-operations.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HrOperationsController],
  providers: [HrOperationsService],
})
export class HrOperationsModule {}
