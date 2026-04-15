import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { CreateFileRecord } from './types/create-file-record.type';

@Injectable()
export class FilesService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM files
       WHERE deleted_at IS NULL`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM files
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`File with id=${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateFileRecord) {
    const result = await this.db.query(
      `INSERT INTO files
       (employee_id, name, file_path, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [dto.employee_id, dto.name, dto.file_path],
    );

    return result.rows[0];
  }

  async update(id: number, dto: UpdateFileDto) {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    if (dto.employee_id !== undefined) {
      fields.push(`employee_id = $${index++}`);
      values.push(dto.employee_id);
    }

    if (dto.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query(
      `UPDATE files
       SET ${fields.join(', ')}
       WHERE id = $${index} AND deleted_at IS NULL
       RETURNING *`,
      values,
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`File with id=${id} not found`);
    }

    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.db.query(
      `UPDATE files
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`File with id=${id} not found`);
    }

    return { message: 'File deleted' };
  }
}