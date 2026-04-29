import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private db: DatabaseService,
    private auditLogService: AuditLogService,
  ) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM organizations WHERE deleted_at IS NULL`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Organization with id=${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateOrganizationDto, userId: number) {
    const result = await this.db.query(
      `INSERT INTO organizations (name, comment, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [dto.name, dto.comment ?? null],
    );

    const created = result.rows[0];

    await this.auditLogService.create({
      user_id: userId,
      entity_type: 'organization',
      entity_id: created.id,
      field_name: 'create',
      old_value: null,
      new_value: JSON.stringify(created),
    });

    return created;
  }

  async update(id: number, dto: UpdateOrganizationDto, userId: number) {
    const before = await this.findOne(id);

    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (dto.comment !== undefined) {
      fields.push(`comment = $${index++}`);
      values.push(dto.comment);
    }

    if (fields.length === 0) {
      return before;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query(
      `UPDATE organizations
       SET ${fields.join(', ')}
       WHERE id = $${index} AND deleted_at IS NULL
       RETURNING *`,
      values,
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Organization with id=${id} not found`);
    }

    const updated = result.rows[0];

    await this.auditLogService.create({
      user_id: userId,
      entity_type: 'organization',
      entity_id: updated.id,
      field_name: 'update',
      old_value: JSON.stringify(before),
      new_value: JSON.stringify(updated),
    });

    return updated;
  }

  async remove(id: number, userId: number) {
    const before = await this.findOne(id);

    const result = await this.db.query(
      `UPDATE organizations
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Organization with id=${id} not found`);
    }

    await this.auditLogService.create({
      user_id: userId,
      entity_type: 'organization',
      entity_id: id,
      field_name: 'delete',
      old_value: JSON.stringify(before),
      new_value: null,
    });

    return { message: 'Organization deleted' };
  }
}