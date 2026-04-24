const API_URL = 'http://localhost:3000';

export interface HrOperation {
    id: number;
    employee_id: number;
    department_id: number | null;
    position_id: number | null;
    operation_type: string;
    operation_date: string;
    salary: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export async function getHrOperations() {
    const response = await fetch(`${API_URL}/hr-operations`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить кадровые операции');
    }

    return response.json() as Promise<HrOperation[]>;
}