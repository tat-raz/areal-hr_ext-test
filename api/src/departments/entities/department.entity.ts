export interface Department {
    id: number;
    name: string;
    organization_id: number;
    parent_id: number | null;
    comment: string | null;
    is_deleted: boolean;
}