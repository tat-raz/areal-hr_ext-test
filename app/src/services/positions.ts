const API_URL = 'http://localhost:3000';

export interface Position {
    id: number;
    name: string;
    department_id: number | null;
    comment: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export async function getPositions() {
    const response = await fetch(`${API_URL}/positions`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить должности');
    }

    return response.json() as Promise<Position[]>;
}