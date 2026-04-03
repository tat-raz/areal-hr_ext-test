import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT * FROM employees
       WHERE deleted_at IS NULL`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM employees
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return result.rows[0];
  }

  async create(dto: CreateEmployeeDto) {
    const result = await this.db.query(
      `INSERT INTO employees (
        name,
        first_name,
        last_name,
        middle_name,
        birth_date,
        passport_series,
        passport_number,
        passport_issue_date,
        passport_code,
        passport_issued_by,
        registration_address,
        registration_city,
        registration_street,
        registration_house,
        registration_building,
        registration_apartment,
        created_at,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16,
        NOW(), NOW()
      )
      RETURNING *`,
      [
        dto.name,
        dto.first_name,
        dto.last_name,
        dto.middle_name ?? null,
        dto.birth_date,
        dto.passport_series ?? null,
        dto.passport_number ?? null,
        dto.passport_issue_date ?? null,
        dto.passport_code ?? null,
        dto.passport_issued_by ?? null,
        dto.registration_address ?? null,
        dto.registration_city ?? null,
        dto.registration_street ?? null,
        dto.registration_house ?? null,
        dto.registration_building ?? null,
        dto.registration_apartment ?? null,
      ],
    );

    return result.rows[0];
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let index = 1;

    if (dto.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(dto.name);
    }

    if (dto.first_name !== undefined) {
      fields.push(`first_name = $${index++}`);
      values.push(dto.first_name);
    }

    if (dto.last_name !== undefined) {
      fields.push(`last_name = $${index++}`);
      values.push(dto.last_name);
    }

    if (dto.middle_name !== undefined) {
      fields.push(`middle_name = $${index++}`);
      values.push(dto.middle_name);
    }

    if (dto.birth_date !== undefined) {
      fields.push(`birth_date = $${index++}`);
      values.push(dto.birth_date);
    }

    if (dto.passport_series !== undefined) {
      fields.push(`passport_series = $${index++}`);
      values.push(dto.passport_series);
    }

    if (dto.passport_number !== undefined) {
      fields.push(`passport_number = $${index++}`);
      values.push(dto.passport_number);
    }

    if (dto.passport_issue_date !== undefined) {
      fields.push(`passport_issue_date = $${index++}`);
      values.push(dto.passport_issue_date);
    }

    if (dto.passport_code !== undefined) {
      fields.push(`passport_code = $${index++}`);
      values.push(dto.passport_code);
    }

    if (dto.passport_issued_by !== undefined) {
      fields.push(`passport_issued_by = $${index++}`);
      values.push(dto.passport_issued_by);
    }

    if (dto.registration_address !== undefined) {
      fields.push(`registration_address = $${index++}`);
      values.push(dto.registration_address);
    }

    if (dto.registration_city !== undefined) {
      fields.push(`registration_city = $${index++}`);
      values.push(dto.registration_city);
    }

    if (dto.registration_street !== undefined) {
      fields.push(`registration_street = $${index++}`);
      values.push(dto.registration_street);
    }

    if (dto.registration_house !== undefined) {
      fields.push(`registration_house = $${index++}`);
      values.push(dto.registration_house);
    }

    if (dto.registration_building !== undefined) {
      fields.push(`registration_building = $${index++}`);
      values.push(dto.registration_building);
    }

    if (dto.registration_apartment !== undefined) {
      fields.push(`registration_apartment = $${index++}`);
      values.push(dto.registration_apartment);
    }

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE employees
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
      `UPDATE employees
       SET deleted_at = NOW()
       WHERE id = $1`,
      [id],
    );

    return { message: 'Employee deleted' };
  }
}