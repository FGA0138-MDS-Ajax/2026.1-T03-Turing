# Endpoints da API

> Base URL: `http://localhost:8000`  
> Todas as requisições autenticadas devem incluir o header:  
> `Authorization: Bearer <token>`

---

## Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/usuarios/login/` | Login — retorna JWT | Não exige |
| POST | `/api/usuarios/login/refresh/` | Renova token JWT | Não exige |
| GET | `/api/usuarios/alunos/` | Lista todos os alunos | Exige |
| POST | `/api/usuarios/alunos/` | Cadastro de aluno | Não exige |
| GET | `/api/usuarios/alunos/{id}/` | Detalha um aluno | Exige |
| PATCH | `/api/usuarios/alunos/{id}/` | Atualiza um aluno | Exige |
| DELETE | `/api/usuarios/alunos/{id}/` | Deleta um aluno | Admin |
| GET | `/api/usuarios/professores/` | Lista todos os professores | Exige |
| POST | `/api/usuarios/professores/` | Cadastro de professor + currículo | Não exige |
| GET | `/api/usuarios/professores/{id}/` | Detalha um professor | Exige |
| PATCH | `/api/usuarios/professores/{id}/` | Atualiza um professor | Exige |
| DELETE | `/api/usuarios/professores/{id}/` | Deleta um professor | Admin |
| POST | `/api/usuarios/professores/create_by_admin/` | Cria professor via admin | Admin |
| GET | `/api/usuarios/administradores/` | Lista todos os admins | Admin |
| POST | `/api/usuarios/administradores/` | Cria novo admin | Admin |
| GET | `/api/usuarios/administradores/{id}/` | Detalha um admin | Admin |
| PATCH | `/api/usuarios/administradores/{id}/` | Atualiza um admin | Admin |
| DELETE | `/api/usuarios/administradores/{id}/` | Deleta um admin | Admin |

---

## Disciplinas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/disciplinas/` | Lista todas as disciplinas | Exige |
| POST | `/api/disciplinas/` | Cria disciplina | Admin |
| GET | `/api/disciplinas/{id}/` | Detalha uma disciplina | Exige |
| PATCH | `/api/disciplinas/{id}/` | Atualiza disciplina | Admin |
| DELETE | `/api/disciplinas/{id}/` | Deleta disciplina | Admin |
| GET | `/api/disciplinas/{id}/conteudos/` | Conteúdos de uma disciplina | Exige |
| GET | `/api/disciplinas/conteudos/` | Lista conteúdos | Exige |
| POST | `/api/disciplinas/conteudos/` | Cria conteúdo | Admin |
| GET | `/api/disciplinas/conteudos/{id}/` | Detalha um conteúdo | Exige |
| PATCH | `/api/disciplinas/conteudos/{id}/` | Atualiza conteúdo | Admin |
| DELETE | `/api/disciplinas/conteudos/{id}/` | Deleta conteúdo | Admin |
| GET | `/api/disciplinas/conteudos/?disciplina={id}` | Filtra conteúdos por disciplina | Exige |
| GET | `/api/disciplinas/conteudos/disponiveis/` | Conteúdos disponíveis para matrícula | Aluno |
| GET | `/api/disciplinas/materiais/` | Lista materiais | Exige |
| POST | `/api/disciplinas/materiais/` | Cria material | Professor/Admin |
| GET | `/api/disciplinas/materiais/{id}/` | Detalha um material | Exige |
| PATCH | `/api/disciplinas/materiais/{id}/` | Atualiza material | Professor/Admin |
| DELETE | `/api/disciplinas/materiais/{id}/` | Deleta material | Professor/Admin |
| GET | `/api/disciplinas/materiais/?conteudo={id}` | Materiais de um conteúdo | Exige |

---

## Matrículas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/matriculas/` | Lista matrículas do aluno | Exige |
| POST | `/api/matriculas/` | Matricula aluno em conteúdo | Aluno |
| DELETE | `/api/matriculas/{id}/` | Cancela matrícula | Aluno |

---

## Interações

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/interacoes/inscricoes/` | Lista inscrições de professores | Admin |
| GET | `/api/interacoes/inscricoes/?status=pendente` | Inscrições pendentes | Admin |
| PATCH | `/api/interacoes/inscricoes/{id}/aprovar/` | Aprova inscrição | Admin |
| PATCH | `/api/interacoes/inscricoes/{id}/rejeitar/` | Rejeita inscrição | Admin |
| GET | `/api/interacoes/foruns/` | Lista fóruns acessíveis | Exige |
| GET | `/api/interacoes/foruns/{id}/` | Detalhes de um fórum | Exige |
| GET | `/api/interacoes/mensagens/` | Lista mensagens | Exige |
| POST | `/api/interacoes/mensagens/` | Envia mensagem | Exige |
| GET | `/api/interacoes/mensagens/{id}/` | Detalha uma mensagem | Exige |
| PATCH | `/api/interacoes/mensagens/{id}/` | Edita mensagem | Autor |
| DELETE | `/api/interacoes/mensagens/{id}/` | Deleta mensagem | Autor |
| GET | `/api/interacoes/mensagens/?forum={id}` | Mensagens de um fórum | Exige |
| GET | `/api/interacoes/mensagens/pendentes/` | Perguntas sem resposta | Professor |

---

## Arquivos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/media/<caminho>/` | Serve arquivo (força download) | Não exige |
| GET | `/media-inline/<caminho>/` | Serve arquivo PDF inline | Exige |