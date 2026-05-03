<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Сотрудники</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-input v-model="firstName" label="Поиск по имени" outlined clearable />
      </div>

      <div class="col-12 col-md-3">
        <q-input v-model="lastName" label="Поиск по фамилии" outlined clearable />
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

      <div class="col-12 col-md-3 flex items-end q-gutter-sm">
        <q-btn
          color="primary"
          label="Найти"
          @click="void loadEmployees()"
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

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="edit" color="primary" @click="openEditDialog(props.row)" />
          <q-btn flat dense icon="delete" color="negative" @click="removeEmployee(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать сотрудника' : 'Добавить сотрудника' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.first_name" label="Имя" outlined class="q-mb-md" />
          <q-input v-model="form.last_name" label="Фамилия" outlined class="q-mb-md" />
          <q-input v-model="form.middle_name" label="Отчество" outlined class="q-mb-md" />

          <q-input
            v-model="form.birth_date"
            type="date"
            label="Дата рождения"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="form.registration_city"
            label="Город"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="form.registration_street"
            label="Улица"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="form.registration_house"
            label="Дом"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="saveEmployee" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type Employee,
  type EmployeeStatus,
} from 'src/services/employees';

const employees = ref<Employee[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const firstName = ref('');
const lastName = ref('');
const status = ref<EmployeeStatus | ''>('');

const dialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  birth_date: '',
  registration_city: '',
  registration_street: '',
  registration_house: '',
});

const statusOptions = [
  { label: 'Активные', value: 'active' },
  { label: 'Уволенные', value: 'dismissed' },
];

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'full_name', label: 'ФИО', field: 'full_name', align: 'left' as const },
  { name: 'status', label: 'Статус', field: 'status', align: 'left' as const },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'left' as const },
];

function openCreateDialog() {
  editingId.value = null;

  form.value = {
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    registration_city: '',
    registration_street: '',
    registration_house: '',
  };

  dialog.value = true;
}

function openEditDialog(row: Employee) {
  editingId.value = row.id;

  form.value = {
    first_name: row.first_name,
    last_name: row.last_name,
    middle_name: row.middle_name ?? '',
    birth_date: row.birth_date ?? '',
    registration_city: row.registration_city ?? '',
    registration_street: row.registration_street ?? '',
    registration_house: row.registration_house ?? '',
  };

  dialog.value = true;
}

async function saveEmployee() {
  try {
    const payload = { ...form.value };

    if (editingId.value) {
      await updateEmployee(editingId.value, payload);
    } else {
      await createEmployee(payload);
    }

    dialog.value = false;
    await loadEmployees();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения сотрудника';
  }
}

async function removeEmployee(id: number) {
  if (!confirm('Удалить сотрудника?')) return;

  try {
    await deleteEmployee(id);
    await loadEmployees();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления сотрудника';
  }
}

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
</script>'