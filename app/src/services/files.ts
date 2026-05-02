const API_URL = import.meta.env.VITE_API_URL;

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
    const response = await fetch(`${API_URL}/files`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить файлы');
    }

    return response.json() as Promise<File[]>;
}