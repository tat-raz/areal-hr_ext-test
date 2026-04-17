<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Сотрудники</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-input
          v-model="firstName"
          label="Поиск по имени"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-3">
        <q-input
          v-model="lastName"
          label="Поиск по фамилии"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-3">
        <q-select
          v-model="status"
          :options="statusOptions"
          label="Статус"
          outlined
          emit-value
          map-options
          clearable
        />
      </div>

      <div class="col-12 col-md-3 flex items-end">
        <q-btn
          color="primary"
          label="Найти"
          @click="void loadEmployees()"
        />
      </div>
    </div>

    <q-banner v-if="errorMessage" class="bg-red-1 text-red q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-table
      title="Список сотрудников"
      :rows="employees"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 'active' ? 'green' : 'red'"
            text-color="white"
          >
            {{ props.row.status === 'active' ? 'Активен' : 'Уволен' }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getEmployees, type Employee, type EmployeeStatus } from 'src/services/employees';

const employees = ref<Employee[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const firstName = ref('');
const lastName = ref('');
const status = ref<EmployeeStatus | ''>('');

const statusOptions = [
  { label: 'Активные', value: 'active' },
  { label: 'Уволенные', value: 'dismissed' },
];

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left' as const,
  },
  {
    name: 'full_name',
    label: 'ФИО',
    field: 'full_name',
    align: 'left' as const,
  },
  {
    name: 'status',
    label: 'Статус',
    field: 'status',
    align: 'left' as const,
  },
];

async function loadEmployees() {
  try {
    loading.value = true;
    errorMessage.value = '';

    const filters: {
      first_name?: string;
      last_name?: string;
      status?: EmployeeStatus;
    } = {};

    if (firstName.value) {
      filters.first_name = firstName.value;
    }

    if (lastName.value) {
      filters.last_name = lastName.value;
    }

    if (status.value) {
      filters.status = status.value;
    }

    employees.value = await getEmployees(filters);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки сотрудников';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadEmployees();
});
</script>