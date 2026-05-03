const API_URL = import.meta.env.VITE_API_URL;

export interface HrOperation {
  id: number;
  employee_id: number;
  department_id: number | null;
  position_id: number | null;
  operation_type: string;
  operation_date: string;
  salary: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function getHrOperations() {
  const response = await fetch(`${API_URL}/hr-operations`, {
      credentials: 'include',
  });

  if (!response.ok) {
      throw new Error('Не удалось загрузить кадровые операции');
  }

  return response.json() as Promise<HrOperation[]>;
}

export async function createHrOperation(payload: {
  employee_id: number;
  department_id?: number | null;
  position_id?: number | null;
  operation_type: string;
  operation_date: string;
  salary?: number | null;
}) {
  const response = await fetch(`${API_URL}/hr-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать кадровую операцию');
  }

  return response.json() as Promise<HrOperation>;
}

export async function updateHrOperation(
  id: number,
  payload: {
    employee_id?: number | null;
    department_id?: number | null;
    position_id?: number | null;
    operation_type?: string;
    operation_date?: string;
    salary?: number | null;
  },
) {
  const response = await fetch(`${API_URL}/hr-operations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить кадровую операцию');
  }

  return response.json() as Promise<HrOperation>;
}

export async function deleteHrOperation(id: number) {
  const response = await fetch(`${API_URL}/hr-operations/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить кадровую операцию');
  }

  return response.json();
}