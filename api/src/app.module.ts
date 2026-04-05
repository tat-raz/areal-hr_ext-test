import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { FilesModule } from './files/files.module';
import { HrOperationsModule } from './hr-operations/hr-operations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule,
    DatabaseModule,
    EmployeesModule,
    FilesModule,
    HrOperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}