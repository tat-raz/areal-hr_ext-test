const API_URL = 'http://localhost:3000';

export type EmployeeStatus = 'active' | 'dismissed';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  full_name: string;
  deleted_at: string | null;
  status?: EmployeeStatus;
}

export interface EmployeeFilters {
  first_name?: string;
  last_name?: string;
  status?: EmployeeStatus;
}

export async function getEmployees(filters: EmployeeFilters = {}) {
  const params = new URLSearchParams();

  if (filters.first_name) {
    params.append('first_name', filters.first_name);
  }

  if (filters.last_name) {
    params.append('last_name', filters.last_name);
  }

  if (filters.status) {
    params.append('status', filters.status);
  }

  const query = params.toString();
  const url = query
    ? `${API_URL}/employees?${query}`
    : `${API_URL}/employees`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Не удалось загрузить сотрудников');
  }

  return response.json() as Promise<Employee[]>;
}