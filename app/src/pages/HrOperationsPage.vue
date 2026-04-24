<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Кадровые операции</div>

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
      title="Список кадровых операций"
      :rows="filteredHrOperations"
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
import { getHrOperations, type HrOperation } from 'src/services/hr-operations';

const hr_operations = ref<HrOperation[]>([]);
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
    name: 'employee_id',
    label: 'Сотрудник',
    field: 'employee_id',
    align: 'left' as const,
  },
  {
    name: 'department_id',
    label: 'Департамент',
    field: (row: HrOperation) => row.department_id ?? '-',
    align: 'left' as const,
  },
  {
    name: 'position_id',
    label: 'Должность',
    field: (row: HrOperation) => row.position_id ?? '-',
    align: 'left' as const,
  },
  {
    name: 'operation_type',
    label: 'Тип операции',
    field: 'operation_type',
    align: 'left' as const,
  },
  {
    name: 'operation_date',
    label: 'Дата операции',
    field: 'operation_date',
    align: 'left' as const,
  },
  {
    name: 'salary',
    label: 'Зарплата',
    field: (row: HrOperation) => row.salary ?? '-',
    align: 'left' as const,
  },
];

const filteredHrOperations = computed(() => {
  return hr_operations.value.filter((hr_operation) =>
    appliedSearch.value
      ? hr_operation.operation_type.toLowerCase().includes(appliedSearch.value.toLowerCase())
      : true,
  );
});

function applySearch() {
    appliedSearch.value = searchInput.value.trim();
}

async function loadHrOperations() {
  try {
    loading.value = true;
    errorMessage.value = '';
    hr_operations.value = await getHrOperations();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка загрузки кадровых операций';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadHrOperations();
});
</script>