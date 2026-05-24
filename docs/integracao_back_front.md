# Documento de Alinhamento de Features 

> **Responsável:** Luana Carvalho de Almeida  
> **Branch de referência:** `developer`

---

## Status geral das features

| Feature | Backend | Frontend | Integração | Status |
|---|---|---|---|---|
| Modelagem do banco |  Pronto | — | — | Completo |
| Cadastro de Aluno | Pronto | Pronto | Integrado | Completo |
| Cadastro de Professor | Pronto | Pronto | Integrado | Completo |
| Upload de currículo (PDF) | Pronto | Pronto | Integrado | Completo |
| Login (JWT) | Pronto | Pronto | Integrado | Completo |
| Cadastro de Admin | Pronto |  Não exposto | — |  Parcial |
| Autenticação e permissões | Pronto | Pronto | Integrado | Completo |
| Gestão de Disciplinas |  Em desenvolvimento |  Não iniciado |  |  Em andamento |
| Gestão de Turmas |  Em desenvolvimento |  Não iniciado |  |  Em andamento |
| Matrícula em Turmas |  Em desenvolvimento |  Não iniciado |  |  Em andamento |
| Fórum de dúvidas |  Não iniciado |  Não iniciado |  |  Pendente |
| Postagem de conteúdo |  Não iniciado |  Não iniciado |  |  Pendente |
| Avaliações e tarefas |  Não iniciado |  Não iniciado |  |  Pendente |
| Denúncias |  Model criada |  Não iniciado |  |  Em andamento |
| Desempenho acadêmico |  Não iniciado |  Não iniciado |  |  Pendente |
| Notificações |  Não iniciado |  Não iniciado |  |  Pendente |
| Acessibilidade |  Não iniciado |  Não iniciado |  |  Pendente |

---

## Endpoints disponíveis no backend

Base URL: `http://localhost:8000`

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/usuarios/login/` | Login — retorna token JWT | Não exige |
| POST | `/api/usuarios/login/refresh/` | Renova o token JWT | Não exige |
| GET | `/api/usuarios/alunos/` | Lista todos os alunos | Exige |
| POST | `/api/usuarios/alunos/` | Cria novo aluno | Não exige |
| GET | `/api/usuarios/alunos/{id}/` | Detalha um aluno | Exige |
| PUT/PATCH | `/api/usuarios/alunos/{id}/` | Atualiza um aluno | Exige |
| DELETE | `/api/usuarios/alunos/{id}/` | Deleta um aluno | Exige |
| GET | `/api/usuarios/professores/` | Lista todos os professores | Exige |
| POST | `/api/usuarios/professores/` | Cria novo professor + currículo | Não exige |
| GET | `/api/usuarios/professores/{id}/` | Detalha um professor | Exige |
| PUT/PATCH | `/api/usuarios/professores/{id}/` | Atualiza um professor | Exige (Admin ou Prof) |
| DELETE | `/api/usuarios/professores/{id}/` | Deleta um professor | Exige (Admin ou Prof) |
| GET | `/api/usuarios/administradores/` | Lista todos os admins | Exige (Admin) |
| POST | `/api/usuarios/administradores/` | Cria novo admin | Exige (Admin) |
| GET | `/api/usuarios/administradores/{id}/` | Detalha um admin | Exige (Admin) |
| PUT/PATCH | `/api/usuarios/administradores/{id}/` | Atualiza um admin | Exige (Admin) |
| DELETE | `/api/usuarios/administradores/{id}/` | Deleta um admin | Exige (Admin) |

> ⚠️ Os endpoints de `disciplinas`, `turmas` e `interacoes` ainda não estão registrados no `config/urls.py`, serão adicionados conforme o backend for implementando os `views.py` e `urls.py` de cada app.

---

## Formato dos dados (back-front)

### Login
**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```
**Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1...",
  "refresh": "eyJhbGciOiJIUzI1..."
}
```
O token `access` contém: `nome`, `email`, `role`, `tipo`.

---

### Cadastro de Aluno
**Request:**
```json
{
  "perfil": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "password": "senha123",
    "data_nascimento": "2000-01-01"
  }
}
```

---

### Cadastro de Professor (com currículo)
**Request:** `multipart/form-data`
```
perfil: {"nome": "...", "email": "...", "cpf": "...", "password": "...", "data_nascimento": "..."}
curriculo: [arquivo PDF, máx 5MB]
```

---

## Páginas do frontend

| Página | Rota | Status | Conectada ao backend |
|---|---|---|---|
| Login | `/login` |  Pronto |  Sim |
| Cadastro | `/register` |  Pronto |  Sim |
| Dashboard | `/dashboard` | Não implementado | |
| Esqueci a senha | `/forgot-password` | Não implementado | |

---

## Problemas identificados

| # | Arquivo | Problema | Prioridade | Ação |
|---|---|---|---|---|
| 1 | `usuarios/urls.py` | `urlpatterns` definido duas vezes e `router.register` de alunos fora do lugar | 🔴 Alta | Corrigir o arquivo |
| 2 | `Register.jsx` | Mensagem de erro genérica no `catch` do cadastro | 🟡 Média | Melhorar tratamento de erros |
| 3 | `ProfessorSerializer` | Método `update` não implementado | 🟡 Média | Adicionar método `update` |
| 4 | `Login.jsx` | `response.data.token` desnecessário na linha do accessToken | 🟢 Baixa | Simplificar para `response.data.access` |

---

## Banco de dados

### Status do banco
- PostgreSQL instalado e configurado 
- Banco `gostudy` criado 
- Django conectado via `.env` 
- Todas as migrations rodadas com sucesso 

### Apps e models criadas

| App | Models | Migrations | Status |
|---|---|---|---|
| `usuarios` | Perfil, Aluno, Professor, Admin |  Rodadas |  Pronto |
| `disciplinas` | Disciplina, DisciplinaPrerequisito |  Rodadas |  Pronto |
| `turmas` | Turma, Matricula, ProfessorTurma |  Rodadas |  Pronto |
| `interacoes` | Pergunta, Resposta, Inscricao, Denuncia |  Rodadas |  Pronto |

### Models pendentes
- `Conteudo`
- `Material`
- `Forum`
- `Avaliacoes`


---

## O que o backend precisa terminar

Para que a integração com o frontend seja possível, o backend precisa implementar para cada app:

| App | O que falta |
|---|---|
| `disciplinas` | `serializers.py`, `views.py`, `urls.py` |
| `turmas` | `serializers.py`, `views.py`, `urls.py` |
| `interacoes` | `serializers.py`, `views.py`, `urls.py` |

Após a conclusão, as rotas serão registradas no `config/urls.py` e o frontend será notificado.

---

## Próximos passos

### Alta prioridade
- [ ] Corrigir bug no `usuarios/urls.py`
- [ ] Implementar método `update` no `ProfessorSerializer`
- [ ] Implementar página de Dashboard
- [ ] Backend terminar `serializers.py`, `views.py` e `urls.py` de `disciplinas`, `turmas` e `interacoes`
- [ ] Registrar URLs dos novos apps no `config/urls.py`

### Média prioridade
- [ ] Melhorar tratamento de erros no `Register.jsx`
- [ ] Criar telas de disciplinas e turmas no frontend
- [ ] Criar models pendentes: `Conteudo`, `Material`, `Forum`, `Avaliacoes`

### Baixa prioridade
- [ ] Simplificar linha do `accessToken` no `Login.jsx`
- [ ] Implementar página de "Esqueci minha senha"

---

## Observações gerais

- O backend e frontend estão **bem alinhados** nas features já implementadas: os endpoints, formatos de dados e fluxos batem corretamente
- O código está organizado, comentado e bem estruturado para um projeto de estudantes
- A autenticação JWT está funcionando corretamente com permissões por perfil
- Cada membro deve criar o próprio `.env` local com suas credenciais — nunca subir o `.env` no GitHub