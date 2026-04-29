import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { DatabaseService } from '../database/database.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
    constructor(
        private db: DatabaseService,
        private auditLogService: AuditLogService,
    ) {}

  async findAll() {
    const result = await this.db.query(
      `
      SELECT
        u.id,
        u.employee_id,
        u.role_id,
        u.login,
        u.created_at,
        u.updated_at,
        u.deleted_at,
        CONCAT_WS(' ', e.last_name, e.first_name, e.middle_name) AS employee_full_name,
        r.name AS role_name
      FROM users u
      JOIN employees e ON e.id = u.employee_id AND e.deleted_at IS NULL
      JOIN roles r ON r.id = u.role_id
      WHERE u.deleted_at IS NULL
      ORDER BY u.id
      `,
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `
      SELECT
        u.id,
        u.employee_id,
        u.role_id,
        u.login,
        u.created_at,
        u.updated_at,
        u.deleted_at,
        CONCAT_WS(' ', e.last_name, e.first_name, e.middle_name) AS employee_full_name,
        r.name AS role_name
      FROM users u
      JOIN employees e ON e.id = u.employee_id
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1 AND u.deleted_at IS NULL
      `,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateUserDto, userId: number) {
    const employee = await this.db.query(
      `SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL`,
      [dto.employee_id],
    );

    if (employee.rowCount === 0) {
      throw new NotFoundException(`Employee with id=${dto.employee_id} not found`);
    }

    const role = await this.db.query(
      `SELECT id FROM roles WHERE id = $1`,
      [dto.role_id],
    );

    if (role.rowCount === 0) {
      throw new NotFoundException(`Role with id=${dto.role_id} not found`);
    }

    const existingLogin = await this.db.query(
      `SELECT id FROM users WHERE login = $1 AND deleted_at IS NULL`,
      [dto.login],
    );

    if (existingLogin.rowCount !== 0) {
      throw new BadRequestException('User with this login already exists');
    }

    const existingEmployeeUser = await this.db.query(
      `SELECT id FROM users WHERE employee_id = $1 AND deleted_at IS NULL`,
      [dto.employee_id],
    );

    if (existingEmployeeUser.rowCount !== 0) {
      throw new BadRequestException('This employee already has a user account');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const result = await this.db.query(
      `
      INSERT INTO users (
        employee_id,
        role_id,
        login,
        password_hash,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, employee_id, role_id, login, created_at, updated_at, deleted_at
      `,
      [dto.employee_id, dto.role_id, dto.login, passwordHash],
    );

    const created = result.rows[0];

    await this.auditLogService.create({
      user_id: userId,
      entity_type: 'user',
      entity_id: created.id,
      field_name: 'create',
      old_value: null,
      new_value: JSON.stringify(created),
    });

    return created;
  }

  async update(id: number, dto: UpdateUserDto, userId: number) {
    const before = await this.findOne(id);

    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    if (dto.employee_id !== undefined) {
      const employee = await this.db.query(
        `SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL`,
        [dto.employee_id],
      );

      if (employee.rowCount === 0) {
        throw new NotFoundException(`Employee with id=${dto.employee_id} not found`);
      }

      const existingEmployeeUser = await this.db.query(
        `SELECT id FROM users WHERE employee_id = $1 AND id <> $2 AND deleted_at IS NULL`,
        [dto.employee_id, id],
      );

      if (existingEmployeeUser.rowCount !== 0) {
        throw new BadRequestException('This employee already has a user account');
      }

      fields.push(`employee_id = $${index++}`);
      values.push(dto.employee_id);
    }

    if (dto.role_id !== undefined) {
      const role = await this.db.query(
        `SELECT id FROM roles WHERE id = $1`,
        [dto.role_id],
      );

      if (role.rowCount === 0) {
        throw new NotFoundException(`Role with id=${dto.role_id} not found`);
      }

      fields.push(`role_id = $${index++}`);
      values.push(dto.role_id);
    }

    if (dto.login !== undefined) {
      const existingLogin = await this.db.query(
        `SELECT id FROM users WHERE login = $1 AND id <> $2 AND deleted_at IS NULL`,
        [dto.login, id],
      );

      if (existingLogin.rowCount !== 0) {
        throw new BadRequestException('User with this login already exists');
      }

      fields.push(`login = $${index++}`);
      values.push(dto.login);
    }

    if (dto.password !== undefined) {
      const passwordHash = await argon2.hash(dto.password, {
        type: argon2.argon2id,
      });

      fields.push(`password_hash = $${index++}`);
      values.push(passwordHash);
    }

    if (fields.length === 0) {
      return before;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query(
      `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${index} AND deleted_at IS NULL
      RETURNING id, employee_id, role_id, login, created_at, updated_at, deleted_at
      `,
      values,
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    const updated = result.rows[0];

    await this.auditLogService.create({
      user_id: userId,
      entity_type: 'user',
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
      `
      UPDATE users
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      `,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    await this.auditLogService.create({
      user_id: userId,
      entity_type: 'user',
      entity_id: id,
      field_name: 'delete',
      old_value: JSON.stringify(before),
      new_value: null,
    });

    return { message: 'User deleted' };
  }

  async findByLogin(login: string) {
    const result = await this.db.query(
      `
      SELECT
        u.id,
        u.employee_id,
        u.role_id,
        u.login,
        u.password_hash,
        r.name AS role_name
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.login = $1 AND u.deleted_at IS NULL
      `,
      [login],
    );

    return result.rows[0] ?? null;
  }

  async findAuthUserById(id: number) {
    const result = await this.db.query(
      `
      SELECT
        u.id,
        u.employee_id,
        u.role_id,
        u.login,
        r.name AS role_name
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1 AND u.deleted_at IS NULL
      `,
      [id],
    );

    return result.rows[0] ?? null;
}
}

