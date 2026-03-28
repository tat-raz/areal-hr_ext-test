import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { DatabaseService } from './database/database.service';


@Module({
    imports: [OrganizationsModule, DepartmentsModule, PositionsModule, ],
    controllers: [AppController],
    providers: [AppService, DatabaseService],
  })

export class AppModule {}
