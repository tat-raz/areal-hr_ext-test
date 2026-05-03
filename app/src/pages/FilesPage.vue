<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Файлы</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input v-model="searchInput" label="Поиск по имени" outlined clearable />
      </div>

      <div class="col-12 col-md-8 flex items-end q-gutter-sm">
        <q-btn color="primary" label="Найти" @click="applySearch" />
        <q-btn color="secondary" label="Добавить" @click="openCreateDialog" />
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
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="edit" color="primary" @click="openEditDialog(props.row)" />
          <q-btn flat dense icon="delete" color="negative" @click="removeFile(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 420px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать файл' : 'Добавить файл' }}
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
            v-model="form.name"
            label="Название"
            outlined
            class="q-mb-md"
          />

          <q-file
            v-if="!editingId"
            v-model="selectedFile"
            label="Файл"
            outlined
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="saveFile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import {
  getFiles,
  createFile,
  updateFile,
  deleteFile,
  type File,
} from 'src/services/files';
import { getEmployees, type Employee } from 'src/services/employees';

const files = ref<File[]>([]);
const employees = ref<Employee[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const searchInput = ref('');
const appliedSearch = ref('');

const dialog = ref(false);
const editingId = ref<number | null>(null);
const selectedFile = ref<globalThis.File | null>(null);

const form = ref({
  employee_id: null as number | null,
  name: '',
});

const columns = [
  { 
    name: 'id', 
    label: 'ID', 
    field: 'id', 
    align: 'left' as const 
  },
  { 
    name: 'name', 
    label: 'Название', 
    field: 'name', 
    align: 'left' as const 
  },
  {
    name: 'employee',
    label: 'Сотрудник',
    field: (row: File) => getEmployeeName(row.employee_id),
    align: 'left' as const,
  },
  { 
    name: 'file_path', 
    label: 'Путь к файлу', 
    field: 'file_path', 
    align: 'left' as const 
  },
  { 
    name: 'actions', 
    label: 'Действия', 
    field: 'actions', 
    align: 'left' as const 
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

function openCreateDialog() {
  editingId.value = null;
  selectedFile.value = null;
  form.value = {
    employee_id: null,
    name: '',
  };
  dialog.value = true;
}

function openEditDialog(row: File) {
  editingId.value = row.id;
  selectedFile.value = null;
  form.value = {
    employee_id: row.employee_id,
    name: row.name,
  };
  dialog.value = true;
}

async function saveFile() {
  try {
    errorMessage.value = '';

    if (!form.value.employee_id || !form.value.name.trim()) {
      errorMessage.value = 'Заполните сотрудника и название файла';
      return;
    }

    if (editingId.value) {
      await updateFile(editingId.value, {
        employee_id: form.value.employee_id,
        name: form.value.name,
      });
    } else {
      if (!selectedFile.value) {
        errorMessage.value = 'Выберите файл';
        return;
      }

      await createFile({
        employee_id: form.value.employee_id,
        name: form.value.name,
        file: selectedFile.value,
      });
    }

    dialog.value = false;
    await loadFiles();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения файла';
  }
}

async function removeFile(id: number) {
  if (!confirm('Удалить файл?')) return;

  try {
    errorMessage.value = '';
    await deleteFile(id);
    await loadFiles();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления файла';
  }
}

function getEmployeeName(id: number | null) {
  return employees.value.find((item) => item.id === id)?.full_name ?? '-';
}

async function loadFiles() {
  try {
    loading.value = true;
    errorMessage.value = '';
    files.value = await getFiles();
    employees.value = await getEmployees();
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