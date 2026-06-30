export function fakeJwt(payload = {}) {
  const header = { alg: 'none', typ: 'JWT' };
  const body = {
    email: 'usuario@gostudy.test',
    nome: 'Usuario Teste',
    tipo: 'aluno',
    role: 'aluno',
    user_id: 1,
    ...payload,
  };

  return `${base64Url(header)}.${base64Url(body)}.assinatura`;
}

export async function loginAs(page, tipo, overrides = {}) {
  const token = fakeJwt({
    tipo,
    role: tipo,
    email: `${tipo}@gostudy.test`,
    nome: `${capitalize(tipo)} Teste`,
    user_id: tipo === 'professor' ? 20 : tipo === 'admin' ? 99 : 10,
    ...overrides,
  });

  await page.addInitScript((authToken) => {
    window.localStorage.setItem('authToken', authToken);
  }, token);
}

function base64Url(value) {
  return Buffer.from(JSON.stringify(value))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
