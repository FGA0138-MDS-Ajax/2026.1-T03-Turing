
# Integração Back-end e Front-end

> **Responsável:** Luana Carvalho de Almeida  
> **Última atualização:** Junho/2026

---

## Visão geral

Este documento registra o processo de integração entre backend e frontend ao longo do projeto GoStudy, incluindo desalinhamentos identificados, como foram resolvidos e o estado atual de cada feature.

---

## Linha do tempo de integração

### Sprint 1 — Cadastro e autenticação
**Situação:** Integração bem-sucedida desde o início.

- Cadastro de aluno e professor funcionando
- Login JWT integrado corretamente
- Upload de currículo integrado via `multipart/form-data`
- Nenhum desalinhamento crítico identificado

---

### Sprint 2 — Administração e PS de professores

**Desalinhamento identificado:**  
O frontend (`TeacherReview.jsx`) chamava `PATCH /api/usuarios/professores/{id}/` para aprovar/rejeitar currículos, mas o backend implementou endpoints específicos:
```
PATCH /api/interacoes/inscricoes/{id}/aprovar/
PATCH /api/interacoes/inscricoes/{id}/rejeitar/
```
Além disso, o frontend filtrava professores pendentes por `Boolean(professor.curriculo)`, mas professores criados pelo admin via `POST /api/usuarios/professores/create_by_admin/` não têm currículo — e nunca apareceriam na lista de pendentes.

**Como foi resolvido:**  
- Backend implementou endpoints específicos de aprovação/rejeição na `Inscricao`
- Frontend atualizado para buscar inscrições pendentes via `GET /api/interacoes/inscricoes/?status=pendente`
- Endpoint `create_by_admin` cria professor já com `is_active=True` e inscrição aprovada automaticamente

---

### Sprint 3 — Disciplinas, conteúdos e materiais

**Desalinhamento 1 — Endpoint de conteúdos por disciplina:**  
O `disciplinasService.js` usava:
```
GET /api/disciplinas/conteudos/?disciplina={id}
```
Mas o backend havia implementado:
```
GET /api/disciplinas/{id}/conteudos/
```

**Como foi resolvido:**  
Adicionado suporte ao filtro por query string no `ConteudoViewSet`:
```python
def get_queryset(self):
    disciplina_id = self.request.query_p```

Substitui o conteúdo do `docs/integracao_back_front.md` por esse. Me fala quando terminar!arams.get('disciplina')
    if disciplina_id:
        queryset = queryset.filter(disciplina_id=disciplina_id)
```
Ambos os padrões passaram a funcionar.

**Desalinhamento 2 — `forum_id` ausente no serializer:**  
O frontend precisava do `forum_id` para navegar ao fórum a partir da página do conteúdo, mas o `ConteudoSerializer` não retornava esse campo.

**Como foi resolvido:**  
Adicionado campo `forum_id` no `ConteudoSerializer`:
```python
forum_id = serializers.IntegerField(source='forum.id', read_only=True)
```

---

### Sprint 4 — Visualização e interação do aluno

**Desalinhamento — Conteúdos disponíveis para matrícula:**  
O frontend buscava todos os conteúdos via `GET /api/disciplinas/conteudos/` esperando receber todos os conteúdos disponíveis. Porém, esse endpoint já filtrava por matrícula para alunos — retornando apenas os conteúdos em que o aluno já estava matriculado.

**Como foi resolvido:**  
Criado endpoint específico:
```
GET /api/disciplinas/conteudos/disponiveis/
```
Retorna apenas conteúdos ativos que o aluno ainda não está matriculado.

**Problema — Renderização de PDFs:**  
O Django servia arquivos com `Content-Disposition: attachment`, forçando download em vez de renderização no browser.

**Como foi resolvido:**  
Criado endpoint que serve arquivos com `Content-Disposition: inline`:
```
GET /media-inline/<caminho>/
```

---

### Sprint 5 — Fórum

**Desalinhamento — Filtro de status em Matricula:**  
As views de fórum filtravam matrículas por `status='ativa'`, mas o campo `status` havia sido removido da `Matricula` por decisão do time.

**Como foi resolvido:**  
Removido o filtro por `status` das queries de fórum. O controle de acesso passou a ser feito apenas pela existência da matrícula.

**Problema — Dependência de migration:**  
A migration `0005` de interacoes apontava para `disciplinas.0004` que não existia na `developer`.

**Como foi resolvido:**  
Corrigida a dependência para `disciplinas.0003` que já estava disponível em todas as branches.

---

## Estado atual dos endpoints

Base URL: `http://localhost:8000`

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/usuarios/login/` | Login — retorna JWT | Não exige |
| POST | `/api/usuarios/login/refresh/` | Renova token | Não exige |
| GET/POST | `/api/usuarios/alunos/` | Lista e cria alunos | Exige |
| GET/PATCH | `/api/usuarios/alunos/{id}/` | Detalha e atualiza aluno | Exige |
| GET/POST | `/api/usuarios/professores/` | Lista e cria professores | Exige |
| GET/PATCH | `/api/usuarios/professores/{id}/` | Detalha e atualiza professor | Exige |
| POST | `/api/usuarios/professores/create_by_admin/` | Cria professor via admin | Admin |
| GET/POST | `/api/usuarios/administradores/` | Lista e cria admins | Admin |

### Disciplinas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET/POST | `/api/disciplinas/` | Lista e cria disciplinas | Exige |
| GET/PATCH/DELETE | `/api/disciplinas/{id}/` | Detalha, edita e deleta disciplina | Exige |
| GET/POST | `/api/disciplinas/conteudos/` | Lista e cria conteúdos | Exige |
| GET | `/api/disciplinas/conteudos/?disciplina={id}` | Filtra conteúdos por disciplina | Exige |
| GET | `/api/disciplinas/conteudos/disponiveis/` | Conteúdos disponíveis para matrícula | Aluno |
| GET | `/api/disciplinas/{id}/conteudos/` | Conteúdos de uma disciplina | Exige |
| GET/POST | `/api/disciplinas/materiais/` | Lista e cria materiais | Exige |
| GET | `/api/disciplinas/materiais/?conteudo={id}` | Materiais de um conteúdo | Exige |

### Matrículas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET/POST | `/api/matriculas/` | Lista matrículas e matricula aluno | Exige |
| DELETE | `/api/matriculas/{id}/` | Cancela matrícula | Exige |

### Interações

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/interacoes/inscricoes/` | Lista inscrições | Admin |
| GET | `/api/interacoes/inscricoes/?status=pendente` | Inscrições pendentes | Admin |
| PATCH | `/api/interacoes/inscricoes/{id}/aprovar/` | Aprova inscrição | Admin |
| PATCH | `/api/interacoes/inscricoes/{id}/rejeitar/` | Rejeita inscrição | Admin |
| GET | `/api/interacoes/foruns/` | Lista fóruns acessíveis ao usuário | Exige |
| GET | `/api/interacoes/foruns/{id}/` | Detalhes do fórum | Exige |
| GET/POST | `/api/interacoes/mensagens/` | Lista e envia mensagens | Exige |
| GET | `/api/interacoes/mensagens/?forum={id}` | Mensagens de um fórum | Exige |
| GET | `/api/interacoes/mensagens/pendentes/` | Perguntas pendentes | Professor |

### Arquivos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/media-inline/<caminho>/` | Serve arquivo PDF inline | Exige |

---

## Formato dos dados

### Login
```json
// Request
{
  "email": "usuario@email.com",
  "password": "senha123"
}

// Response
{
  "access": "eyJhbGciOiJIUzI1...",
  "refresh": "eyJhbGciOiJIUzI1..."
}
```

### Cadastro de aluno
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

### Cadastro de professor (multipart/form-data)
```
perfil: {"nome": "...", "email": "...", "cpf": "...", "password": "...", "data_nascimento": "..."}
curriculo: [arquivo PDF]
```

### Criar professor via admin
```json
{
  "perfil": {
    "nome": "nome professor",
    "email": "professor@email.com",
    "cpf": "12345678901",
    "password": "123456",
    "data_nascimento": "1990-01-01"
  }
}
```

### Enviar mensagem no fórum
```json
{
  "forum": 1,
  "texto": "Qual é a diferença entre fração própria e imprópria?",
  "resposta_para": null
}
```

---

## Regras de acesso por perfil

| Recurso | Admin | Professor | Aluno |
|---------|-------|-----------|-------|
| Disciplinas (escrita) | ✅ | ❌ | ❌ |
| Disciplinas (leitura) | ✅ | ✅ | ✅ |
| Conteúdos (escrita) | ✅ | ❌ | ❌ |
| Materiais (escrita) | ✅ | ✅ | ❌ |
| Matrículas | ✅ | ❌ | ✅ |
| Inscrições de professores | ✅ | ❌ | ❌ |
| Fórum (leitura) | ✅ | ✅ (próprios) | ✅ (matriculados) |
| Fórum (escrita) | ✅ | ✅ | ✅ |
| Responder mensagem | ✅ | ✅ | ❌ |

---

## Observações gerais

- O backend e frontend trabalham de forma desacoplada via API REST — nenhuma lógica de negócio fica no cliente
- Toda autenticação é feita via JWT no header `Authorization: Bearer <token>`
- Arquivos de mídia ficam em `/media/` — para renderizar PDFs inline usar `/media-inline/<caminho>/`
- O `.env` nunca deve ser commitado — cada dev cria o próprio localmente baseado no `.env.example`
