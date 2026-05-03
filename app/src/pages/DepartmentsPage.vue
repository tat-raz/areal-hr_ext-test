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
      title="Список департаментов"
      :rows="filteredDepartments"
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
            @click="removeDepartment(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать департамент' : 'Добавить департамент' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="form.name"
            label="Название"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model.number="form.organization_id"
            label="ID организации"
            type="number"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model.number="form.parent_id"
            label="ID родительского департамента"
            type="number"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="form.comment"
            label="Комментарий"
            outlined
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="saveDepartment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type Department,
} from 'src/services/departments';

const departments = ref<Department[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const searchInput = ref('');
const appliedSearch = ref('');

const dialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  name: '',
  organization_id: null as number | null,
  parent_id: null as number | null,
  comment: '',
});

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
    field: (row: Department) => row.parent_id ?? '—',
    align: 'left' as const,
  },
  {
    name: 'comment',
    label: 'Комментарий',
    field: 'comment',
    align: 'left' as const,
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
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

function openCreateDialog() {
  editingId.value = null;
  form.value = {
    name: '',
    organization_id: null,
    parent_id: null,
    comment: '',
  };
  dialog.value = true;
}

function openEditDialog(row: Department) {
  editingId.value = row.id;
  form.value = {
    name: row.name,
    organization_id: row.organization_id,
    parent_id: row.parent_id,
    comment: row.comment ?? '',
  };
  dialog.value = true;
}

async function saveDepartment() {
  try {
    errorMessage.value = '';

    if (!form.value.name.trim()) {
      errorMessage.value = 'Введите название департамента';
      return;
    }

    if (editingId.value) {
      await updateDepartment(editingId.value, form.value);
    } else {
      await createDepartment(form.value);
    }

    dialog.value = false;
    await loadDepartments();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения департамента';
  }
}

async function removeDepartment(id: number) {
  if (!confirm('Удалить департамент?')) {
    return;
  }

  try {
    errorMessage.value = '';
    await deleteDepartment(id);
    await loadDepartments();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления департамента';
  }
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