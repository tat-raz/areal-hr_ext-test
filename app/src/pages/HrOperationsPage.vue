<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Кадровые операции</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="searchInput"
          label="Поиск по типу операции"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-8 flex items-end q-gutter-sm">
        <q-btn
          color="primary"
          label="Найти"
          @click="applySearch"
        />

        <q-btn
          color="secondary"
          label="Добавить"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <q-banner v-if="errorMessage" class="bg-red-1 text-red q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-table
      title="Список кадровых операций"
      :rows="filteredHrOperations"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            icon="edit"
            color="primary"
            @click="openEditDialog(props.row)"
          />

          <q-btn
            flat
            dense
            icon="delete"
            color="negative"
            @click="removeHrOperation(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать операцию' : 'Добавить операцию' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.number="form.employee_id"
            label="ID сотрудника"
            type="number"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model.number="form.department_id"
            label="ID департамента"
            type="number"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model.number="form.position_id"
            label="ID должности"
            type="number"
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="form.operation_type"
            :options="operationTypeOptions"
            label="Тип операции"
            outlined
            emit-value
            map-options
            class="q-mb-md"
          />

          <q-input
            v-model="form.operation_date"
            label="Дата операции"
            type="date"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model.number="form.salary"
            label="Зарплата"
            type="number"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="saveHrOperation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import {
  getHrOperations,
  createHrOperation,
  updateHrOperation,
  deleteHrOperation,
  type HrOperation,
} from 'src/services/hr-operations';

import { getEmployees, type Employee } from 'src/services/employees';
import { getDepartments, type Department } from 'src/services/departments';
import { getPositions, type Position } from 'src/services/positions';

const hr_operations = ref<HrOperation[]>([]);
const employees = ref<Employee[]>([]);
const departments = ref<Department[]>([]);
const positions = ref<Position[]>([]);

const loading = ref(false);
const errorMessage = ref('');

const searchInput = ref('');
const appliedSearch = ref('');

const dialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  employee_id: null as number | null,
  department_id: null as number | null,
  position_id: null as number | null,
  operation_type: '',
  operation_date: '',
  salary: null as number | null,
});

const operationTypeOptions = [
  { label: 'Приём на работу', value: 'hire' },
  { label: 'Перевод', value: 'transfer' },
  { label: 'Повышение', value: 'promotion' },
  { label: 'Увольнение', value: 'dismiss' },
];

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left' as const,
  },
  {
    name: 'employee_id',
    label: 'Сотрудник',
    field: (row: HrOperation) => getEmployeeName(row.employee_id),
    align: 'left' as const,
  },
  {
    name: 'department_id',
    label: 'Департамент',
    field: (row: HrOperation) => getDepartmentName(row.department_id),
    align: 'left' as const,
  },
  {
    name: 'position_id',
    label: 'Должность',
    field: (row: HrOperation) => getPositionName(row.position_id),
    align: 'left' as const,
  },
  {
    name: 'operation_type',
    label: 'Тип операции',
    field: 'operation_type',
    align: 'left' as const,
  },
  {
    name: 'operation_date',
    label: 'Дата операции',
    field: 'operation_date',
    align: 'left' as const,
  },
  {
    name: 'salary',
    label: 'Зарплата',
    field: (row: HrOperation) => row.salary ?? '-',
    align: 'left' as const,
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
    align: 'left' as const,
  },
];

const filteredHrOperations = computed(() => {
  return hr_operations.value.filter((hr_operation) =>
    appliedSearch.value
      ? hr_operation.operation_type
          .toLowerCase()
          .includes(appliedSearch.value.toLowerCase())
      : true,
  );
});

function applySearch() {
  appliedSearch.value = searchInput.value.trim();
}

function openCreateDialog() {
  editingId.value = null;
  form.value = {
    employee_id: null,
    department_id: null,
    position_id: null,
    operation_type: '',
    operation_date: '',
    salary: null,
  };
  dialog.value = true;
}

function openEditDialog(row: HrOperation) {
  editingId.value = row.id;
  form.value = {
    employee_id: row.employee_id,
    department_id: row.department_id,
    position_id: row.position_id,
    operation_type: row.operation_type,
    operation_date: row.operation_date?.slice(0, 10) ?? '',
    salary: row.salary,
  };
  dialog.value = true;
}

async function saveHrOperation() {
  console.log(form.value);
  try {
    errorMessage.value = '';

    if (!form.value.employee_id || !form.value.operation_type || !form.value.operation_date) {
      errorMessage.value = 'Заполните сотрудника, тип операции и дату';
      return;
    }

    if (editingId.value) {
      await updateHrOperation(editingId.value, {
        employee_id: form.value.employee_id,
        department_id: form.value.department_id,
        position_id: form.value.position_id,
        operation_type: form.value.operation_type,
        operation_date: form.value.operation_date,
        salary: form.value.salary,
      });
    } else {
      await createHrOperation({
        employee_id: form.value.employee_id,
        department_id: form.value.department_id,
        position_id: form.value.position_id,
        operation_type: form.value.operation_type,
        operation_date: form.value.operation_date,
        salary: form.value.salary,
      });
    }

    dialog.value = false;
    await loadHrOperations();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения кадровой операции';
  }
}

async function removeHrOperation(id: number) {
  if (!confirm('Удалить кадровую операцию?')) {
    return;
  }

  try {
    errorMessage.value = '';
    await deleteHrOperation(id);
    await loadHrOperations();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления кадровой операции';
  }
}

function getEmployeeName(id: number | null) {
  return employees.value.find((item) => item.id === id)?.full_name ?? '-';
}

function getDepartmentName(id: number | null) {
  return departments.value.find((item) => item.id === id)?.name ?? '-';
}

function getPositionName(id: number | null) {
  return positions.value.find((item) => item.id === id)?.name ?? '-';
}

async function loadHrOperations() {
  try {
    loading.value = true;
    errorMessage.value = '';
    hr_operations.value = await getHrOperations();
    employees.value = await getEmployees();
    departments.value = await getDepartments();
    positions.value = await getPositions();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки кадровых операций';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadHrOperations();
});
</script>