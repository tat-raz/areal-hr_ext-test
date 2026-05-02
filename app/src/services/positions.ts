const API_URL = import.meta.env.VITE_API_URL;

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
    const response = await fetch(`${API_URL}/positions`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить должности');
    }

    return response.json() as Promise<Position[]>;
}