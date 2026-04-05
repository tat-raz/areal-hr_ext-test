export interface HrOperation {
  id: number;
  employee_id: number;
  department_id: number;
  position_id: number;
  operation_type: string;
  operation_date: string;
  salary: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}