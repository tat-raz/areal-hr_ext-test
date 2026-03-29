import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';


@Module({
    imports: [OrganizationsModule, DepartmentsModule, PositionsModule, DatabaseModule],
    controllers: [AppController],
    providers: [AppService],
  })

export class AppModule {}
