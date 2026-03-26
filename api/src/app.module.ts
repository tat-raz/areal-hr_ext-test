import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [OrganizationsModule, DepartmentsModule, PositionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
