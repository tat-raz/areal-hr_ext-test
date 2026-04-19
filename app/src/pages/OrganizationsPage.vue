<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Организации</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="search"
          label="Поиск по названию"
          outlined
          clearable
        />
      </div>

      <div class="col-12 col-md-6 flex items-end">
        <q-btn
          color="primary"
          label="Обновить"
          @click="void loadOrganizations()"
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
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  getOrganizations,
  type Organization,
} from 'src/services/organizations';

const organizations = ref<Organization[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const search = ref('');

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
];

const filteredOrganizations = computed(() => {
  return organizations.value.filter((organization) =>
    search.value
      ? organization.name.toLowerCase().includes(search.value.toLowerCase())
      : true,
  );
});

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