<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> HR System </q-toolbar-title>

        <q-btn 
          flat 
          :label="currentUser ? 'Выйти' : 'Войти'" 
          @click="handleAuthButton" 
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { useRouter, useRoute } from 'vue-router';
import { logout, getCurrentUser } from 'src/services/auth';

const router = useRouter();
const route = useRoute();

const currentUser = ref(null);

async function loadCurrentUser() {
  currentUser.value = await getCurrentUser();
}

async function handleAuthButton() {
  if (currentUser.value) {
    await logout();
    currentUser.value = null;
    await router.push('/login');
  } else {
    await router.push('/login');
  }
}

onMounted(() => {
  void loadCurrentUser();
});

watch(
  () => route.fullPath,
  () => {
    void loadCurrentUser();
  },
);

const linksList: EssentialLinkProps[] = [
  {
    title: 'Сотрудники',
    caption: 'Открыть список сотрудников',
    icon: 'people',
    link: '/employees',
  },
  {
    title: 'Пользователи',
    caption: 'Открыть список пользователей',
    icon: 'person',
    link: '/users',
  },
  {
    title: 'Организации',
    caption: 'Открыть список организаций',
    icon: 'business',
    link: '/organizations',
  },
  {
    title: 'Департаменты',
    caption: 'Открыть список департаментов',
    icon: 'account_tree',
    link: '/departments',
  },
  {
    title: 'Должности',
    caption: 'Открыть список должностей',
    icon: 'badge',
    link: '/positions',
  },
  {
    title: 'Файлы',
    caption: 'Открыть список файлов',
    icon: 'description',
    link: '/files',
  },
  {
    title: 'Кадровые операции',
    caption: 'Открыть список кадровых операций',
    icon: 'assignment',
    link: '/hr-operations',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
