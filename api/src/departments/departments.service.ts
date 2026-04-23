import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';


@Injectable()
export class DepartmentsService {
  constructor(
    private db: DatabaseService,
    private auditLogService: AuditLogService,
  ) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM departments
       WHERE deleted_at IS NULL`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM departments
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Department with id=${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateDepartmentDto) {
    const result = await this.db.query(
      `INSERT INTO departments
      (name, organization_id, parent_id, comment, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *`,
      [
        dto.name,
        dto.organization_id,
        dto.parent_id ?? null,
        dto.comment ?? null,
      ],
    );
    
    const created = result.rows[0];

    await this.auditLogService.create({
      user_id: 1,
      entity_type: 'department',
      entity_id: created.id,
      field_name: 'create',
      old_value: null,
      new_value: JSON.stringify(created),
    });

    return created;
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const before = await this.findOne(id);

    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (dto.organization_id !== undefined) {
      fields.push(`organization_id = $${index++}`);
      values.push(dto.organization_id);
    }

    if (dto.parent_id !== undefined) {
      fields.push(`parent_id = $${index++}`);
      values.push(dto.parent_id);
    }

    if (dto.comment !== undefined) {
      fields.push(`comment = $${index++}`);
      values.push(dto.comment);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query(
      `UPDATE departments
       SET ${fields.join(', ')}
       WHERE id = $${index} AND deleted_at IS NULL
       RETURNING *`,
      values,
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Department with id=${id} not found`);
    }

    const updated = result.rows[0];

    await this.auditLogService.create({
      user_id: 1,
      entity_type: 'department',
      entity_id: updated.id,
      field_name: 'update',
      old_value: JSON.stringify(before),
      new_value: JSON.stringify(updated),
    });

    return updated;
  }

  async remove(id: number) {
    const before = await this.findOne(id);

    const result = await this.db.query(
      `UPDATE departments
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Department with id=${id} not found`);
    }

    await this.auditLogService.create({
      user_id: 1,
      entity_type: 'department',
      entity_id: id,
      field_name: 'delete',
      old_value: JSON.stringify(before),
      new_value: null,
    });

    return { message: 'Department deleted' };
  }
}