const API_URL = import.meta.env.VITE_API_URL;

export type EmployeeStatus = 'active' | 'dismissed';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  full_name: string;

  birth_date: string;

  passport_series: string | null;
  passport_number: string | null;
  passport_issue_date: string | null;
  passport_code: string | null;
  passport_issued_by: string | null;

  registration_address: string | null;
  registration_city: string | null;
  registration_street: string | null;
  registration_house: string | null;
  registration_building: string | null;
  registration_apartment: string | null;

  created_at?: string;
  updated_at?: string;
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

  if (filters.first_name) params.append('first_name', filters.first_name);
  if (filters.last_name) params.append('last_name', filters.last_name);
  if (filters.status) params.append('status', filters.status);

  const query = params.toString();

  const url = query
    ? `${API_URL}/employees?${query}`
    : `${API_URL}/employees`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить сотрудников');
  }

  return response.json() as Promise<Employee[]>;
}

export async function createEmployee(payload: Partial<Employee>) {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать сотрудника');
  }

  return response.json() as Promise<Employee>;
}

export async function updateEmployee(
  id: number,
  payload: Partial<Employee>,
) {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить сотрудника');
  }

  return response.json() as Promise<Employee>;
}

export async function deleteEmployee(id: number) {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить сотрудника');
  }

  return response.json();
}