const API_URL = 'http://localhost:3000';

export interface Organization {
  id: number;
  name: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function getOrganizations() {
  const response = await fetch(`${API_URL}/organizations`);

  if (!response.ok) {
    throw new Error('Не удалось загрузить организации');
  }

  return response.json() as Promise<Organization[]>;
}