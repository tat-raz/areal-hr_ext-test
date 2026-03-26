export class CreateDepartmentDto {
    name: string;
    organization_id: number;
    parent_id?: number;
    comment?: string;
}