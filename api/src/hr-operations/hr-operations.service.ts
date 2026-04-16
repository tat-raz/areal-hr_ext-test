import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';


@Injectable()
export class HrOperationsService {
  constructor(
    private db: DatabaseService,
    private auditLogService: AuditLogService,
  ) {}

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

    if (result.rowCount === 0) {
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

    const created = result.rows[0];

    await this.auditLogService.create({
      user_id: 1,
      entity_type: 'hr-operation',
      entity_id: created.id,
      field_name: 'create',
      old_value: null,
      new_value: JSON.stringify(created),
    });

    return created;
  }

  async update(id: number, dto: UpdateHrOperationDto) {
    const before = await this.findOne(id);

    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    if (dto.employee_id !== undefined) {
      const employee = await this.db.query(
        `SELECT id FROM employees
         WHERE id = $1 AND deleted_at IS NULL`,
        [dto.employee_id],
      );

      if (employee.rowCOunt === 0) {
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

      if (department.rowCount === 0) {
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

      if (position.rowCount === 0) {
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
    values.push(id);

    const result = await this.db.query(
      `UPDATE hr_operations
       SET ${fields.join(', ')}
       WHERE id = $${index} AND deleted_at IS NULL
       RETURNING *`,
      values,
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`HR operation with id=${id} not found`);
    }

    const updated = result.rows[0];

    await this.auditLogService.create({
      user_id: 1,
      entity_type: 'hr-operation',
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
      `UPDATE hr_operations
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`HR operation with id=${id} not found`);
    }

    await this.auditLogService.create({
      user_id: 1,
      entity_type: 'hr-operation',
      entity_id: id,
      field_name: 'delete',
      old_value: JSON.stringify(before),
      new_value: null,
    });

    return { message: 'HR operation deleted' };
  }
}