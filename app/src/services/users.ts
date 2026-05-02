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