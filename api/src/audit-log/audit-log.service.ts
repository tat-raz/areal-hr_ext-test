import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';


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
}