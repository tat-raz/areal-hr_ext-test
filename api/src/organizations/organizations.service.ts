import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM organizations
       WHERE deleted_at IS NULL`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM organizations
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return result.rows[0];
  }

  async create(dto: CreateOrganizationDto) {
    const result = await this.db.query(
      `INSERT INTO organizations
       (name, comment, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [dto.name, dto.comment ?? null],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let index = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (dto.comment !== undefined) {
      fields.push(`comment = $${index++}`);
      values.push(dto.comment);
    }

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE organizations
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
      `UPDATE organizations
       SET deleted_at = NOW()
       WHERE id = $1`,
      [id],
    );
    return { message: 'Organization deleted' };
  }
}