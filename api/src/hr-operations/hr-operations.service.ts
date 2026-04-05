import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';

@Injectable()
export class HrOperationsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM hr_operations
       WHERE deleted_at IS NULL
       ORDER BY id`,
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM hr_operations
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`HR operation with id=${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateHrOperationDto) {
    const employee = await this.db.query(
      `SELECT id FROM employees
       WHERE id = $1 AND deleted_at IS NULL`,
      [dto.employee_id],
    );

    if (employee.rows.length === 0) {
      throw new NotFoundException(
        `Employee with id=${dto.employee_id} not found`,
      );
    }

    const department = await this.db.query(
      `SELECT id FROM departments
       WHERE id = $1 AND deleted_at IS NULL`,
      [dto.department_id],
    );

    if (department.rows.length === 0) {
      throw new NotFoundException(
        `Department with id=${dto.department_id} not found`,
      );
    }

    const position = await this.db.query(
      `SELECT id FROM positions
       WHERE id = $1 AND deleted_at IS NULL`,
      [dto.position_id],
    );

    if (position.rows.length === 0) {
      throw new NotFoundException(
        `Position with id=${dto.position_id} not found`,
      );
    }

    const result = await this.db.query(
      `INSERT INTO hr_operations (
        employee_id,
        department_id,
        position_id,
        operation_type,
        operation_date,
        salary,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [
        dto.employee_id,
        dto.department_id,
        dto.position_id,
        dto.operation_type,
        dto.operation_date,
        dto.salary,
      ],
    );

    return result.rows[0];
  }

  async update(id: number, dto: UpdateHrOperationDto) {
    const existing = await this.db.query(
      `SELECT id FROM hr_operations
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    if (existing.rows.length === 0) {
      throw new NotFoundException(`HR operation with id=${id} not found`);
    }

    const fields: string[] = [];
    const values: (string | number)[] = [];
    let index = 1;

    if (dto.employee_id !== undefined) {
      const employee = await this.db.query(
        `SELECT id FROM employees
         WHERE id = $1 AND deleted_at IS NULL`,
        [dto.employee_id],
      );

      if (employee.rows.length === 0) {
        throw new NotFoundException(
          `Employee with id=${dto.employee_id} not found`,
        );
      }

      fields.push(`employee_id = $${index++}`);
      values.push(dto.employee_id);
    }

    if (dto.department_id !== undefined) {
      const department = await this.db.query(
        `SELECT id FROM departments
         WHERE id = $1 AND deleted_at IS NULL`,
        [dto.department_id],
      );

      if (department.rows.length === 0) {
        throw new NotFoundException(
          `Department with id=${dto.department_id} not found`,
        );
      }

      fields.push(`department_id = $${index++}`);
      values.push(dto.department_id);
    }

    if (dto.position_id !== undefined) {
      const position = await this.db.query(
        `SELECT id FROM positions
         WHERE id = $1 AND deleted_at IS NULL`,
        [dto.position_id],
      );

      if (position.rows.length === 0) {
        throw new NotFoundException(
          `Position with id=${dto.position_id} not found`,
        );
      }

      fields.push(`position_id = $${index++}`);
      values.push(dto.position_id);
    }

    if (dto.operation_type !== undefined) {
      fields.push(`operation_type = $${index++}`);
      values.push(dto.operation_type);
    }

    if (dto.operation_date !== undefined) {
      fields.push(`operation_date = $${index++}`);
      values.push(dto.operation_date);
    }

    if (dto.salary !== undefined) {
      fields.push(`salary = $${index++}`);
      values.push(dto.salary);
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE hr_operations
      SET ${fields.join(', ')}
      WHERE id = $${index} AND deleted_at IS NULL
      RETURNING *
    `;

    values.push(id);

    const result = await this.db.query(query, values);

    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.db.query(
      `UPDATE hr_operations
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`HR operation with id=${id} not found`);
    }

    return { message: 'HR operation deleted' };
  }
}