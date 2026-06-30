import { expect, test } from '@playwright/test';
import { findRequest, mockApi, requestsFor } from './helpers/apiMock';
import { loginAs } from './helpers/auth';

test.describe('criacao de models principais', () => {
  test('admin cria disciplina, conteudo e material', async ({ page }) => {
    const { requests } = await mockApi(page);
    await loginAs(page, 'admin');

    await page.goto('/admin/conteudos');

    await page.getByRole('button', { name: /Nova disciplina/ }).click();
    await page.locator('.disc-modal').locator('input').first().fill('Fisica');
    await page.getByPlaceholder(/Breve/).fill('Mecanica e energia');
    await page.getByRole('button', { name: /Criar Disciplina/ }).click();
    await expect(page.getByText(/Disciplina criada/)).toBeVisible();

    await page.getByRole('button', { name: /Novo conte/ }).click();
    await page.locator('.disc-modal').locator('input').first().fill('Cinematica');
    await page.locator('.disc-modal select').selectOption('1');
    await page.locator('.disc-modal textarea').fill('Movimento retilineo');
    await page.getByRole('button', { name: /Criar Conte/ }).click();
    await expect(page.getByText(/Conte.*do criado/)).toBeVisible();

    await page.getByRole('button', { name: /Novo material/ }).click();
    await page.getByRole('button', { name: /Link externo/ }).click();
    await page.getByPlaceholder(/Introdu/).fill('Video aula de cinematica');
    await page.locator('.pm-modal select').selectOption('10');
    await page.getByPlaceholder('desc do material').fill('Material complementar');
    await page.getByPlaceholder('https://...').fill('https://example.com/cinematica');
    await page.locator('.pm-modal').getByRole('button', { name: 'Adicionar', exact: true }).click();
    await expect(page.getByText(/Material criado/)).toBeVisible();

    expect(JSON.parse(findRequest(requests, 'POST', '/api/disciplinas/').postData)).toMatchObject({
      nome: 'Fisica',
      descricao: 'Mecanica e energia',
    });
    expect(JSON.parse(findRequest(requests, 'POST', '/api/disciplinas/conteudos/').postData)).toMatchObject({
      nome: 'Cinematica',
      disciplina: 1,
      professores: [],
    });
    expect(findRequest(requests, 'POST', '/api/disciplinas/materiais/').postData).toContain('Video aula de cinematica');
  });

  test('admin matricula aluno em conteudo como criacao relacionada', async ({ page }) => {
    const { requests } = await mockApi(page, { matriculas: [] });
    await loginAs(page, 'admin');

    await page.goto('/admin/conteudos');
    await page.getByRole('button', { name: /Alunos \(0\)/ }).click();
    await page.getByPlaceholder(/Buscar aluno/).fill('Bia');
    await page.getByText('Bia Aluna').click();

    await expect(page.getByText(/Aluno matriculado/)).toBeVisible();
    expect(JSON.parse(findRequest(requests, 'POST', '/api/matriculas/').postData)).toEqual({
      conteudo: 10,
      aluno: 5,
    });
  });

  test('aluno cria mensagem no forum e cria denuncia', async ({ page }) => {
    const { requests } = await mockApi(page);
    await loginAs(page, 'aluno');

    await page.goto('/aluno/conteudos/10/forum');
    await expect(page.getByText('Duvida inicial').first()).toBeVisible();

    await page.getByRole('button', { name: /Perguntar algo/ }).click();
    await page.getByPlaceholder(/duvida/).fill('Nova pergunta');
    await page.locator('.modal-textarea').fill('Como aplicar a formula?');
    await page.getByRole('button', { name: /Enviar pergunta/ }).click();
    await expect(page.getByText(/Pergunta enviada/)).toBeVisible();

    await page.getByLabel('Denunciar pergunta').first().click();
    await page.locator('.modal-select').selectOption('Spam ou propaganda');
    await page.locator('.modal-textarea').fill('Mensagem repetida fora do contexto');
    await page.getByRole('button', { name: /Enviar den/ }).click();
    await expect(page.getByText(/Den.*ncia enviada/)).toBeVisible();

    const mensagens = requestsFor(requests, 'POST', '/api/interacoes/mensagens/');
    expect(JSON.parse(mensagens.at(-1).postData)).toEqual({
      forum: 55,
      texto: 'Nova pergunta\n\nComo aplicar a formula?',
    });
    expect(JSON.parse(findRequest(requests, 'POST', '/api/interacoes/denuncias/').postData)).toMatchObject({
      mensagem: 900,
      motivo: 'Spam ou propaganda',
      descricao: 'Mensagem repetida fora do contexto',
      evidencias: 'Mensagem repetida fora do contexto',
    });
  });
});
