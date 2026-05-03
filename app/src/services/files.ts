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

export async function createFile(payload: {
  employee_id: number;
  name: string;
  file: globalThis.File;
}) {
  const formData = new FormData();
  formData.append('employee_id', String(payload.employee_id));
  formData.append('name', payload.name);
  formData.append('file', payload.file);

  const response = await fetch(`${API_URL}/files`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Не удалось создать файл');
  }

  return response.json() as Promise<File>;
}

export async function updateFile(
  id: number,
  payload: {
    employee_id: number;
    name: string;
  },
) {
  const response = await fetch(`${API_URL}/files/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить файл');
  }

  return response.json() as Promise<File>;
}

export async function deleteFile(id: number) {
  const response = await fetch(`${API_URL}/files/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить файл');
  }

  return response.json();
}