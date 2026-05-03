<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Пользователи</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="login"
          label="Поиск по логину"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-4">
        <q-select
          v-model="role"
          :options="roleOptions"
          label="Роль"
          outlined
          emit-value
          map-options
          clearable
        />
      </div>

      <div class="col-12 col-md-4 flex items-end q-gutter-sm">
        <q-btn
          color="primary"
          label="Найти"
          @click="void loadUsers()"
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
      title="Список пользователей"
      :rows="filteredUsers"
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
            @click="removeUser(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать пользователя' : 'Добавить пользователя' }}
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
            v-model="form.login"
            label="Логин"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-if="!editingId"
            v-model="form.password"
            label="Пароль"
            type="password"
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="form.role_id"
            :options="roleIdOptions"
            label="Роль"
            outlined
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="saveUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
} from 'src/services/users';

const users = ref<User[]>([]);
const filteredUsers = ref<User[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const login = ref<string | null>(null);
const role = ref<string | null>(null);

const dialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  employee_id: null as number | null,
  login: '',
  password: '',
  role_id: null as number | null,
});

const roleOptions = [
  { label: 'Администратор', value: 'admin' },
  { label: 'HR manager', value: 'hr_manager' },
];

const roleIdOptions = [
  { label: 'Администратор', value: 1 },
  { label: 'HR manager', value: 2 },
];

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'employee_full_name', label: 'Сотрудник', field: 'employee_full_name', align: 'left' as const },
  { name: 'login', label: 'Логин', field: 'login', align: 'left' as const },
  { name: 'role_name', label: 'Роль', field: 'role_name', align: 'left' as const },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'left' as const },
];

function openCreateDialog() {
  editingId.value = null;
  form.value = {
    employee_id: null,
    login: '',
    password: '',
    role_id: null,
  };
  dialog.value = true;
}

function openEditDialog(row: User) {
  editingId.value = row.id;
  form.value = {
    employee_id: row.employee_id,
    login: row.login,
    password: '',
    role_id: row.role_id,
  };
  dialog.value = true;
}

async function saveUser() {
  try {
    errorMessage.value = '';

    if (!form.value.employee_id || !form.value.login.trim() || !form.value.role_id) {
      errorMessage.value = 'Заполните сотрудника, логин и роль';
      return;
    }

    if (!editingId.value && !form.value.password.trim()) {
      errorMessage.value = 'Введите пароль';
      return;
    }

    if (editingId.value) {
      await updateUser(editingId.value, {
        employee_id: form.value.employee_id,
        login: form.value.login,
        role_id: form.value.role_id,
      });
    } else {
      await createUser({
        employee_id: form.value.employee_id,
        login: form.value.login,
        password: form.value.password,
        role_id: form.value.role_id,
      });
    }

    dialog.value = false;
    await loadUsers();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения пользователя';
  }
}

async function removeUser(id: number) {
  if (!confirm('Удалить пользователя?')) {
    return;
  }

  try {
    errorMessage.value = '';
    await deleteUser(id);
    await loadUsers();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления пользователя';
  }
}

async function loadUsers() {
  try {
    loading.value = true;
    errorMessage.value = '';

    users.value = await getUsers();

    const loginQuery = (login.value ?? '').trim().toLowerCase();

    filteredUsers.value = users.value.filter((user) => {
      const matchesLogin = loginQuery
        ? user.login.toLowerCase().includes(loginQuery)
        : true;

      const matchesRole = role.value
        ? user.role_name === role.value
        : true;

      return matchesLogin && matchesRole;
    });
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки пользователей';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadUsers();
});
</script>