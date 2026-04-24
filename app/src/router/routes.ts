import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'employees', component: () => import('pages/EmployeesPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'organizations', component: () => import('pages/OrganizationsPage.vue') },
      { path: 'departments', component: () => import('pages/DepartmentsPage.vue') },
      { path: 'positions', component: () => import('pages/PositionsPage.vue') },
      { path: 'files', component: () => import('pages/FilesPage.vue') },
      { path: 'hr-operations', component: () => import('pages/HrOperationsPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;