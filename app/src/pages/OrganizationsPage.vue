<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Организации</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-5">
        <q-input
          v-model="searchInput"
          label="Поиск по названию"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-7 flex items-end q-gutter-sm">
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
      title="Список организаций"
      :rows="filteredOrganizations"
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
            @click="removeOrganization(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingId ? 'Редактировать организацию' : 'Добавить организацию' }}
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
            v-model="form.comment"
            label="Комментарий"
            outlined
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="saveOrganization" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type Organization,
} from 'src/services/organizations';

const organizations = ref<Organization[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const searchInput = ref('');
const appliedSearch = ref('');

const dialog = ref(false);
const editingId = ref<number | null>(null);

const form = ref({
  name: '',
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

const filteredOrganizations = computed(() => {
  return organizations.value.filter((organization) =>
    appliedSearch.value
      ? organization.name.toLowerCase().includes(appliedSearch.value.toLowerCase())
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
    comment: '',
  };
  dialog.value = true;
}

function openEditDialog(row: Organization) {
  editingId.value = row.id;
  form.value = {
    name: row.name,
    comment: row.comment ?? '',
  };
  dialog.value = true;
}

async function saveOrganization() {
  try {
    errorMessage.value = '';

    if (editingId.value) {
      await updateOrganization(editingId.value, form.value);
    } else {
      await createOrganization(form.value);
    }

    dialog.value = false;
    await loadOrganizations();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка сохранения организации';
  }
}

async function removeOrganization(id: number) {
  try {
    errorMessage.value = '';
    await deleteOrganization(id);
    await loadOrganizations();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка удаления организации';
  }
}

async function loadOrganizations() {
  try {
    loading.value = true;
    errorMessage.value = '';
    organizations.value = await getOrganizations();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки организаций';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadOrganizations();
});
</script>