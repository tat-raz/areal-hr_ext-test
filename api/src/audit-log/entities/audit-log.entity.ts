export class AuditLog {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number;
  field_name: string;
  old_value?: string | null;
  new_value?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}