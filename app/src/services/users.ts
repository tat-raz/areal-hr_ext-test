const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: number;
  employee_id: number;
  role_id: number;
  login: string;
  employee_full_name: string;
  role_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить пользователей');
  }

  return response.json() as Promise<User[]>;
}

export async function createUser(payload: {
  employee_id: number;
  login: string;
  password: string;
  role_id: number;
}) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать пользователя');
  }

  return response.json() as Promise<User>;
}

export async function updateUser(
  id: number,
  payload: {
    employee_id: number;
    login: string;
    role_id: number;
  },
) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить пользователя');
  }

  return response.json() as Promise<User>;
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить пользователя');
  }

  return response.json();
}