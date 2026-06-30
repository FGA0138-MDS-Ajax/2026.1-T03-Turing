import { expect, test } from '@playwright/test';
import { mockApi } from './helpers/apiMock';
import { loginAs } from './helpers/auth';

test.describe('permissoes por perfil', () => {
  test('usuario anonimo e redirecionado para login ao acessar area protegida', async ({ page }) => {
    await mockApi(page);

    await page.goto('/admin');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'GoStudy' })).toBeVisible();
  });

  test('aluno nao acessa rotas de admin', async ({ page }) => {
    await mockApi(page);
    await loginAs(page, 'aluno');

    await page.goto('/admin');

    await expect(page).toHaveURL(/\/403$/);
    await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
  });

  test('professor nao acessa rotas de aluno', async ({ page }) => {
    await mockApi(page);
    await loginAs(page, 'professor');

    await page.goto('/aluno');

    await expect(page).toHaveURL(/\/403$/);
    await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
  });

  test('admin acessa dashboard administrativo', async ({ page }) => {
    await mockApi(page);
    await loginAs(page, 'admin');

    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Dashboard do Administrador' })).toBeVisible();
  });
});
