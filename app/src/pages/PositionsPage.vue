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
      title="Список должностей"
      :rows="filteredPositions"
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
import { getPositions, type Position } from 'src/services/positions';

const positions = ref<Position[]>([]);
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
    name: 'department_id',
    label: 'Департамент',
    field: 'department_id',
    align: 'left' as const,
  },
  {
    name: 'comment',
    label: 'Комментарий',
    field: 'comment',
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

function applySearch() {
    appliedSearch.value = searchInput.value.trim();
}

async function loadPositions() {
  try {
    loading.value = true;
    errorMessage.value = '';
    positions.value = await getPositions();
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