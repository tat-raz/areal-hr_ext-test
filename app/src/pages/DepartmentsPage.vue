<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Департаменты</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="searchInput"
          label="Поиск по имени"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-4 flex items-end">
        <q-btn
          color="primary"
          label="Найти"
          @click="applySearch"
        />
      </div>
    </div>

    <q-banner v-if="errorMessage" class="bg-red-1 text-red q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-table
      title="Список департаментов"
      :rows="filteredDepartments"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getDepartments, type Department } from 'src/services/departments';

const departments = ref<Department[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const searchInput = ref('');
const appliedSearch = ref('');

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left' as const,
  },
  {
    name: 'name',
    label: 'Название',
    field: 'name',
    align: 'left' as const,
  },
  {
    name: 'organization_id',
    label: 'Организация',
    field: 'organization_id',
    align: 'left' as const,
  },
  {
    name: 'parent_id',
    label: 'Родительский департамент',
    field: 'parent_id',
    align: 'left' as const,
  },
  {
    name: 'comment',
    label: 'Комментарий',
    field: 'comment',
    align: 'left' as const,
  },
];

const filteredDepartments = computed(() => {
  return departments.value.filter((department) =>
    appliedSearch.value
      ? department.name.toLowerCase().includes(appliedSearch.value.toLowerCase())
      : true,
  );
});

function applySearch() {
    appliedSearch.value = searchInput.value.trim();
}

async function loadDepartments() {
  try {
    loading.value = true;
    errorMessage.value = '';
    departments.value = await getDepartments();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки департаментов';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDepartments();
});
</script>