const API_URL = import.meta.env.VITE_API_URL;

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
  const response = await fetch(`${API_URL}/departments`, {
      credentials: 'include',
  });

  if (!response.ok) {
      throw new Error('Не удалось загрузить департаменты');
  }

  return response.json() as Promise<Department[]>;
}

export async function createDepartment(payload: {
  name: string;
  organization_id?: number | null;
  parent_id?: number | null;
  comment?: string | null;
}) {
  const response = await fetch(`${API_URL}/departments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать департамент');
  }

  return response.json() as Promise<Department>;
}

export async function updateDepartment(
  id: number,
  payload: {
    name: string;
    organization_id?: number | null;
    parent_id?: number | null;
    comment?: string | null;
  },
) {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить департамент');
  }

  return response.json() as Promise<Department>;
}

export async function deleteDepartment(id: number) {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить департамент');
  }

  return response.json();
}


