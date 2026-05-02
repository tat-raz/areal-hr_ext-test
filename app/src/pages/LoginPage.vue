<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h5 text-center">Вход</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="loginValue"
          label="Логин"
          outlined
          class="q-mb-md"
        />

        <q-input
          v-model="password"
          label="Пароль"
          type="password"
          outlined
          class="q-mb-md"
        />

        <q-btn
          label="Войти"
          color="primary"
          class="full-width"
          @click="handleLogin"
        />
      </q-card-section>

      <q-card-section v-if="errorMessage">
        <div class="text-negative text-center">
          {{ errorMessage }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from 'src/services/auth';

const router = useRouter();

const loginValue = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleLogin() {
  try {
    errorMessage.value = '';

    await login(loginValue.value, password.value);

    await router.push('/employees');
  } catch {
    errorMessage.value = 'Неверный логин или пароль';
  }
}
</script>


