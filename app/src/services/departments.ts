const API_URL = 'http://localhost:3000';

export interface Department {
    id: number;
    name: string;
    organization_id: number | null;
    parent_id: number | null;
    comment: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export async function getDepartments() {
    const response = await fetch(`${API_URL}/departmenrs`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить департаменты');
    }

    return response.json() as Promise<Department[]>;
}