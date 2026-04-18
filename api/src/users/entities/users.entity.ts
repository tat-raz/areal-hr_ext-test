export interface User {
  id: number;
  employee_id: number;
  role_id: number;
  login: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}