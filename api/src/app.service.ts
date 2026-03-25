import { Injectable, OnModuleInit } from '@nestjs/common';
import { pool } from './database';

@Injectable()
export class AppService implements OnModuleInit {

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    const res = await pool.query('SELECT NOW()');
    console.log('DB TIME:', res.rows);
  }

}