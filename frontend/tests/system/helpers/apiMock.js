export const apiBase = 'http://localhost:8000';

export const seedData = {
  disciplinas: [
    { id: 1, nome: 'Matematica', descricao: 'Base de calculo', data_create: '2026-06-01T10:00:00Z' },
  ],
  conteudos: [
    {
      id: 10,
      nome: 'Funcoes',
      descricao: 'Introducao a funcoes',
      disciplina: 1,
      professores: [7],
      forum_id: 55,
    },
  ],
  materiais: [
    {
      id: 100,
      nome: 'Lista inicial',
      descricao: 'Exercicios',
      tipo: 'link',
      conteudo: 10,
      link: 'https://example.com/lista',
      data_create: '2026-06-02T10:00:00Z',
    },
  ],
  professores: [
    {
      id: 7,
      perfil: {
        id: 20,
        nome: 'Ada Professora',
        email: 'ada@gostudy.test',
        cpf: '52998224725',
        data_nascimento: '1988-01-10',
      },
      curriculo: 'ada.pdf',
      status: 'aprovado',
    },
  ],
  alunos: [
    {
      id: 5,
      perfil: {
        id: 10,
        nome: 'Bia Aluna',
        email: 'bia@gostudy.test',
        cpf: '15350946056',
        data_nascimento: '2004-02-15',
      },
    },
  ],
  matriculas: [
    {
      id: 501,
      aluno: 5,
      conteudo: 10,
      conteudo_detalhes: {
        nome: 'Funcoes',
        descricao: 'Introducao a funcoes',
        status: 'ativo',
      },
      disciplina_id: 1,
      matriculado_em: '2026-06-03T10:00:00Z',
    },
  ],
  mensagens: [
    {
      id: 900,
      forum: 55,
      titulo: 'Duvida inicial',
      texto: 'Duvida inicial\n\nComo resolver f(x)?',
      autor_nome: 'Bia Aluna',
      autor_tipo: 'aluno',
      resposta_para: null,
      data_create: '2026-06-04T10:00:00Z',
    },
  ],
  denuncias: [],
};

export async function mockApi(page, overrides = {}) {
  const state = clone({ ...seedData, ...overrides });
  const requests = [];

  await page.route(`${apiBase}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const path = url.pathname;

    if (method !== 'GET') {
      requests.push({
        method,
        path,
        postData: request.postData(),
        headers: request.headers(),
      });
    }

    if (path === '/api/usuarios/alunos/' && method === 'GET') {
      return route.fulfill({ status: 200, json: state.alunos });
    }
    if (path === '/api/usuarios/alunos/' && method === 'POST') {
      state.alunos.push(makeUser(await parseBody(request), state.alunos.length + 20));
      return route.fulfill({ status: 201, json: last(state.alunos) });
    }

    if (path === '/api/usuarios/professores/' && method === 'GET') {
      return route.fulfill({ status: 200, json: state.professores });
    }
    if ((path === '/api/usuarios/professores/' || path === '/api/usuarios/professores/create_by_admin/') && method === 'POST') {
      state.professores.push(makeUser(await parseBody(request), state.professores.length + 30));
      return route.fulfill({ status: 201, json: last(state.professores) });
    }

    if (path === '/admin/create' && method === 'POST') {
      return route.fulfill({ status: 201, json: { id: 1, ...(await request.postDataJSON()) } });
    }
    if (path === '/admin/list' && method === 'GET') {
      return route.fulfill({ status: 200, json: [] });
    }

    if (path === '/api/disciplinas/' && method === 'GET') {
      return route.fulfill({ status: 200, json: state.disciplinas });
    }
    if (path === '/api/disciplinas/' && method === 'POST') {
      const body = await request.postDataJSON();
      state.disciplinas.push({ id: state.disciplinas.length + 2, data_create: new Date().toISOString(), ...body });
      return route.fulfill({ status: 201, json: last(state.disciplinas) });
    }

    const disciplinaMatch = path.match(/^\/api\/disciplinas\/(\d+)\/$/);
    if (disciplinaMatch && method === 'GET') {
      const disciplina = state.disciplinas.find((item) => item.id === Number(disciplinaMatch[1]));
      return route.fulfill({ status: disciplina ? 200 : 404, json: disciplina || {} });
    }

    if (path === '/api/disciplinas/conteudos/' && method === 'GET') {
      return route.fulfill({ status: 200, json: state.conteudos });
    }
    if (path === '/api/disciplinas/conteudos/' && method === 'POST') {
      const body = await request.postDataJSON();
      state.conteudos.push({ id: state.conteudos.length + 11, forum_id: 77, ...body });
      return route.fulfill({ status: 201, json: last(state.conteudos) });
    }

    const conteudoMatch = path.match(/^\/api\/disciplinas\/conteudos\/(\d+)\/$/);
    if (conteudoMatch && method === 'GET') {
      const conteudo = state.conteudos.find((item) => item.id === Number(conteudoMatch[1]));
      return route.fulfill({ status: conteudo ? 200 : 404, json: conteudo || {} });
    }

    if (path === '/api/disciplinas/materiais/' && method === 'GET') {
      const conteudo = url.searchParams.get('conteudo');
      const data = conteudo
        ? state.materiais.filter((item) => String(item.conteudo) === conteudo)
        : state.materiais;
      return route.fulfill({ status: 200, json: data });
    }
    if (path === '/api/disciplinas/materiais/' && method === 'POST') {
      state.materiais.push({ id: state.materiais.length + 101, nome: 'Material criado', tipo: 'link', conteudo: 10 });
      return route.fulfill({ status: 201, json: last(state.materiais) });
    }

    if (path === '/api/matriculas/' && method === 'GET') {
      return route.fulfill({ status: 200, json: state.matriculas });
    }
    if (path === '/api/matriculas/' && method === 'POST') {
      const body = await request.postDataJSON();
      state.matriculas.push({ id: state.matriculas.length + 502, ...body });
      return route.fulfill({ status: 201, json: last(state.matriculas) });
    }

    if (path === '/api/interacoes/mensagens/' && method === 'GET') {
      const forum = url.searchParams.get('forum');
      const data = forum ? state.mensagens.filter((item) => String(item.forum) === forum) : state.mensagens;
      return route.fulfill({ status: 200, json: data });
    }
    if (path === '/api/interacoes/mensagens/' && method === 'POST') {
      const body = await request.postDataJSON();
      const mensagem = {
        id: state.mensagens.length + 901,
        autor_nome: 'Bia Aluna',
        autor_tipo: 'aluno',
        resposta_para: null,
        data_create: new Date().toISOString(),
        ...body,
      };
      state.mensagens.push(mensagem);
      return route.fulfill({ status: 201, json: mensagem });
    }

    if (path === '/api/interacoes/denuncias/' && method === 'GET') {
      return route.fulfill({ status: 200, json: state.denuncias });
    }
    if (path === '/api/interacoes/denuncias/' && method === 'POST') {
      const body = await request.postDataJSON();
      state.denuncias.push({ id: state.denuncias.length + 1, ...body });
      return route.fulfill({ status: 201, json: last(state.denuncias) });
    }

    return route.fulfill({ status: 200, json: [] });
  });

  return { state, requests };
}

export function findRequest(requests, method, path) {
  return requests.find((request) => request.method === method && request.path === path);
}

export function requestsFor(requests, method, path) {
  return requests.filter((request) => request.method === method && request.path === path);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function last(value) {
  return value[value.length - 1];
}

async function parseBody(request) {
  const contentType = request.headers()['content-type'] || '';
  if (contentType.includes('application/json')) {
    return request.postDataJSON();
  }

  const data = request.postData() || '';
  if (data.includes('perfil=')) {
    const params = new URLSearchParams(data);
    const perfil = params.get('perfil');
    return { perfil: perfil ? JSON.parse(perfil) : {} };
  }

  return {};
}

function makeUser(body, id) {
  const perfil = body?.perfil || {};
  return {
    id,
    perfil: {
      id: id + 100,
      nome: perfil.nome || 'Usuario criado',
      email: perfil.email || 'criado@gostudy.test',
      cpf: perfil.cpf || '52998224725',
      data_nascimento: perfil.data_nascimento || '2000-01-01',
    },
    curriculo: body?.curriculo || null,
  };
}
