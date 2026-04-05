import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM audit_log
       WHERE deleted_at IS NULL`,
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM audit_log
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    return result.rows[0];
  }

  async create(dto: CreateAuditLogDto) {
    const result = await this.db.query(
      `INSERT INTO audit_log (
        user_id,
        entity_type,
        entity_id,
        field_name,
        old_value,
        new_value,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [
        dto.user_id,
        dto.entity_type,
        dto.entity_id,
        dto.field_name,
        dto.old_value ?? null,
        dto.new_value ?? null,
      ],
    );

    return result.rows[0];
  }

  async update(id: number, dto: UpdateAuditLogDto) {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let index = 1;

    if (dto.user_id !== undefined) {
      fields.push(`user_id = $${index++}`);
      values.push(dto.user_id);
    }

    if (dto.entity_type !== undefined) {
      fields.push(`entity_type = $${index++}`);
      values.push(dto.entity_type);
    }

    if (dto.entity_id !== undefined) {
      fields.push(`entity_id = $${index++}`);
      values.push(dto.entity_id);
    }

    if (dto.field_name !== undefined) {
      fields.push(`field_name = $${index++}`);
      values.push(dto.field_name);
    }

    if (dto.old_value !== undefined) {
      fields.push(`old_value = $${index++}`);
      values.push(dto.old_value);
    }

    if (dto.new_value !== undefined) {
      fields.push(`new_value = $${index++}`);
      values.push(dto.new_value);
    }

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE audit_log
      SET ${fields.join(', ')}
      WHERE id = $${index} AND deleted_at IS NULL
      RETURNING *
    `;

    values.push(id);

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    await this.db.query(
      `UPDATE audit_log
       SET deleted_at = NOW()
       WHERE id = $1`,
      [id],
    );

    return { message: 'Audit log deleted' };
  }
}