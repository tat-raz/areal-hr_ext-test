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

export async function createPosition(payload: {
  name: string;
  department_id?: number | null;
  comment?: string | null;
}) {
  const response = await fetch(`${API_URL}/positions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать должность');
  }

  return response.json() as Promise<Position>;
}

export async function updatePosition(
  id: number,
  payload: {
    name: string;
    department_id?: number | null;
    comment?: string | null;
  },
) {
  const response = await fetch(`${API_URL}/positions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить должность');
  }

  return response.json() as Promise<Position>;
}

export async function deletePosition(id: number) {
  const response = await fetch(`${API_URL}/positions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить должность');
  }

  return response.json();
}