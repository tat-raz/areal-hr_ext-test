const API_URL = import.meta.env.VITE_API_URL;

export interface Organization {
  id: number;
  name: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function getOrganizations() {
  const response = await fetch(`${API_URL}/organizations`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить организации');
  }

  return response.json() as Promise<Organization[]>;
}

export async function createOrganization(payload: {
  name: string;
  comment?: string | null;
}) {
  const response = await fetch(`${API_URL}/organizations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать организацию');
  }

  return response.json() as Promise<Organization>;
}

export async function updateOrganization(
  id: number,
  payload: {
    name: string;
    comment?: string | null;
  },
) {
  const response = await fetch(`${API_URL}/organizations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить организацию');
  }

  return response.json() as Promise<Organization>;
}

export async function deleteOrganization(id: number) {
  const response = await fetch(`${API_URL}/organizations/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить организацию');
  }

  return response.json();
}