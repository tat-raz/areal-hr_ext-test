import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM positions
       WHERE deleted_at IS NULL`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM positions
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return result.rows[0];
  }

  async create(dto: CreatePositionDto) {
    const result = await this.db.query(
      `INSERT INTO positions
       (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       RETURNING *`,
      [dto.name],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdatePositionDto) {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    let index = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(dto.name);
    }

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE positions
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
      `UPDATE positions
       SET deleted_at = NOW()
       WHERE id = $1`,
      [id],
    );
    return { message: 'Position deleted' };
  }
}