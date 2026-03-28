export interface Organization {
    id: number;
    name: string;
    comment?: string | null;
    is_deleted: boolean;
}