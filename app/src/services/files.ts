const API_URL = 'http://localhost:3000';

export interface File {
    id: number;
    name: string;
    employee_id: number;
    file_path: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export async function getFiles() {
    const response = await fetch(`${API_URL}/files`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить файлы');
    }

    return response.json() as Promise<File[]>;
}