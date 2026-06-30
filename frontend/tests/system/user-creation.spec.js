import { expect, test } from '@playwright/test';
import { findRequest, mockApi } from './helpers/apiMock';
import { loginAs } from './helpers/auth';

test.describe('criacao de usuarios', () => {
  test('cria aluno pelo cadastro publico', async ({ page }) => {
    const { requests } = await mockApi(page);
    page.on('dialog', (dialog) => dialog.accept());

    await page.goto('/register');
    await page.locator('#nome').fill('Carla Aluna');
    await page.locator('#email').fill('carla.aluna@gostudy.test');
    await page.locator('#cpf').fill('52998224725');
    await page.locator('#data_nascimento').fill('2004-05-20');
    await page.locator('#senha').fill('Senha123!');
    await page.locator('#confirmar_senha').fill('Senha123!');
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL(/\/login$/);
    const request = findRequest(requests, 'POST', '/api/usuarios/alunos/');
    expect(JSON.parse(request.postData)).toMatchObject({
      perfil: {
        nome: 'Carla Aluna',
        email: 'carla.aluna@gostudy.test',
        cpf: '52998224725',
      },
    });
  });

  test('solicita cadastro de professor pelo link publico com curriculo em PDF', async ({ page }) => {
    const { requests } = await mockApi(page);
    page.on('dialog', (dialog) => dialog.accept());

    await page.goto('/register');
    await page.locator('#nome').fill('Paulo Professor');
    await page.locator('#email').fill('paulo.professor@gostudy.test');
    await page.locator('#cpf').fill('15350946056');
    await page.locator('#data_nascimento').fill('1990-09-12');
    await page.locator('#account_type').selectOption('professor');
    await page.locator('#curriculo').setInputFiles({
      name: 'curriculo.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 teste'),
    });
    await page.locator('#senha').fill('Senha123!');
    await page.locator('#confirmar_senha').fill('Senha123!');
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.evaluate(() => window.localStorage.getItem('authToken'))).resolves.toBeNull();
    const request = findRequest(requests, 'POST', '/api/usuarios/professores/');
    expect(request.postData).toContain('Paulo Professor');
    expect(request.postData).toContain('paulo.professor@gostudy.test');
    expect(request.postData).toContain('curriculo.pdf');
  });

  test('admin cria novo administrador pela sidebar', async ({ page }) => {
    const { requests } = await mockApi(page);
    await loginAs(page, 'admin');

    await page.goto('/admin');
    await page.getByRole('button', { name: /Adicionar Admin/ }).click();
    await page.getByPlaceholder('Nome completo').fill('Ana Admin');
    await page.getByPlaceholder('E-mail').fill('ana.admin@gostudy.test');
    await page.getByPlaceholder(/Senha/).fill('SenhaAdmin123!');
    await page.getByRole('button', { name: 'Criar' }).click();

    await expect(page.getByText(/Administrador criado/)).toBeVisible();
    const request = findRequest(requests, 'POST', '/admin/create');
    expect(JSON.parse(request.postData)).toEqual({
      name: 'Ana Admin',
      email: 'ana.admin@gostudy.test',
      password: 'SenhaAdmin123!',
    });
  });
});
