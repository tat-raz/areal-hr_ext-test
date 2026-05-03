<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Должности</div>

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
        <q-btn color="primary" label="Найти" @click="applySearch" />
        <q-btn color="secondary" label="Добавить" @click="openCreateDialog" />
      </div>
    </div>

    <q-banner v-if="errorMessage" class="bg-red-1 text-red q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-table
      title="Список должностей"
      :rows="filteredPositions"
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
            @click="removePosition(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать должность' : 'Добавить должность' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="form.name"
            label="Название"
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="form.department_id"
            :options="departmentOptions"
            label="Департамент"
            outlined
            emit-value
            map-options
            clearable
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
          <q-btn color="primary" label="Сохранить" @click="savePosition" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  type Position,
} from 'src/services/positions';
import { getDepartments, type Department } from 'src/services/departments';

const positions = ref<Position[]>([]);
const departments = ref<Department[]>([]);

const loading = ref(false);
const errorMessage = ref('');

const searchInput = ref('');
const appliedSearch = ref('');

const dialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  name: '',
  department_id: null as number | null,
  comment: '',
});

const departmentOptions = computed(() =>
  departments.value.map((department) => ({
    label: department.name,
    value: department.id,
  })),
);

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
    name: 'department',
    label: 'Департамент',
    field: (row: Position) => getDepartmentName(row.department_id),
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

const filteredPositions = computed(() => {
  return positions.value.filter((position) =>
    appliedSearch.value
      ? position.name.toLowerCase().includes(appliedSearch.value.toLowerCase())
      : true,
  );
});

function getDepartmentName(id: number | null) {
  return departments.value.find((department) => department.id === id)?.name ?? '-';
}

function applySearch() {
  appliedSearch.value = searchInput.value.trim();
}

function openCreateDialog() {
  editingId.value = null;

  form.value = {
    name: '',
    department_id: null,
    comment: '',
  };

  dialog.value = true;
}

function openEditDialog(row: Position) {
  editingId.value = row.id;

  form.value = {
    name: row.name,
    department_id: row.department_id ?? null,
    comment: row.comment ?? '',
  };

  dialog.value = true;
}

async function savePosition() {
  try {
    errorMessage.value = '';

    if (!form.value.name.trim()) {
      errorMessage.value = 'Введите название должности';
      return;
    }

    if (editingId.value) {
      await updatePosition(editingId.value, {
        name: form.value.name,
        department_id: form.value.department_id,
        comment: form.value.comment,
      });
    } else {
      await createPosition({
        name: form.value.name,
        department_id: form.value.department_id,
        comment: form.value.comment,
      });
    }

    dialog.value = false;
    await loadPositions();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения должности';
  }
}

async function removePosition(id: number) {
  if (!confirm('Удалить должность?')) {
    return;
  }

  try {
    errorMessage.value = '';
    await deletePosition(id);
    await loadPositions();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления должности';
  }
}

async function loadPositions() {
  try {
    loading.value = true;
    errorMessage.value = '';

    positions.value = await getPositions();
    departments.value = await getDepartments();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки должностей';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadPositions();
});
</script>