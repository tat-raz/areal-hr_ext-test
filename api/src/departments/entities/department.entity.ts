export interface Department {
  id: number;
  name: string;
  organization_id: number;
  parent_id: number | null;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}