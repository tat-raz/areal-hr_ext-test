export interface FileEntity {
  id: number;
  employee_id: number;
  name: string;
  file_path: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}