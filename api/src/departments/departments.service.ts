import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private db: DatabaseService) {}

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
    return result.rows[0];
  }

  async create(dto: CreateDepartmentDto) {
    const result = await this.db.query(
      `INSERT INTO departments
       (name, organization_id, parent_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [dto.name, dto.organization_id, dto.parent_id ?? null],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
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

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE departments
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
      `UPDATE departments
       SET deleted_at = NOW()
       WHERE id = $1`,
      [id],
    );
    return { message: 'Department deleted' };
  }
}