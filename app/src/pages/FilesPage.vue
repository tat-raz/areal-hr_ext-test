<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Файлы</div>

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
      title="Список файлов"
      :rows="filteredFiles"
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
import { getFiles, type File } from 'src/services/files';

const files = ref<File[]>([]);
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
    name: 'employee_id',
    label: 'Сотрудник',
    field: 'employee_id',
    align: 'left' as const,
  },
  {
    name: 'file_path',
    label: 'Путь к файлу',
    field: 'file_path',
    align: 'left' as const,
  },
];

const filteredFiles = computed(() => {
  return files.value.filter((file) =>
    appliedSearch.value
      ? file.name.toLowerCase().includes(appliedSearch.value.toLowerCase())
      : true,
  );
});

function applySearch() {
    appliedSearch.value = searchInput.value.trim();
}

async function loadFiles() {
  try {
    loading.value = true;
    errorMessage.value = '';
    files.value = await getFiles();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки файлов';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadFiles();
});
</script>