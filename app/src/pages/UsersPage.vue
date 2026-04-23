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

      <div class="col-12 col-md-4 flex items-end">
        <q-btn
          color="primary"
          label="Найти"
          @click="void loadUsers()"
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
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUsers, type User } from 'src/services/users';

const users = ref<User[]>([]);
const filteredUsers = ref<User[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const login = ref<string | null>(null);
const role = ref<string | null>(null);

const roleOptions = [
  { label: 'Администратор', value: 'admin' },
  { label: 'HR manager', value: 'hr_manager' },
];

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'employee_full_name', label: 'Сотрудник', field: 'employee_full_name' },
  { name: 'login', label: 'Логин', field: 'login' },
  { name: 'role_name', label: 'Роль', field: 'role_name' },
];

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


