# Como Contribuir

Este documento descreve o fluxo de desenvolvimento adotado pelo time Turing para contribuir com o projeto GoStudy.

---

## Pré-requisitos

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Git

---

## Configuração do ambiente

Siga o guia completo em [Setup do Ambiente](setup_ambiente.md).

---

## Fluxo de desenvolvimento

```text
feat/nome-da-feature
        ↓
    developer
        ↓
      testes
        ↓
       main
```

### Processo detalhado

1. Criar branch a partir da `developer`
2. Desenvolver a funcionalidade
3. Abrir PR para `developer`
4. Code review pela equipe
5. Merge para `developer`
6. Validação de testes
7. Merge para `main`

### 1. Abra ou escolha uma issue
Toda contribuição deve estar vinculada a uma issue. Se não existir, crie antes de começar.

### 2. Crie uma branch
```bash
git checkout developer
git pull origin developer
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-da-correcao
```

### 3. Desenvolva
- Escreva o código
- Siga os padrões definidos em [Padronização](padronizacao.md)
- Adicione testes quando necessário

### 4. Commit
```bash
git add .
git commit -m "feat: descrição objetiva do que foi feito"
git push origin feat/nome-da-feature
```

### 5. Abra um Pull Request
- Base: `developer`
- Título claro e descritivo
- Descreva o que foi feito, por que e como testar
- Vincule à issue com `Closes #numero`

### 6. Code Review
- Aguarde aprovação de pelo menos um membro do time
- Responda os comentários e faça os ajustes necessários

### 7. Merge
- Após aprovação, o PR é mergeado na `developer`
- A `main` recebe merges apenas após validação completa

---

## Padrão de branches

| Prefixo | Uso |
|---------|-----|
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `docs/` | Documentação |
| `style/` | Ajustes visuais sem lógica |
| `test/` | Testes |

---

## Padrão de commits

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `style:` | Formatação sem impacto na lógica |
| `test:` | Testes |
| `refactor:` | Refatoração sem mudança de comportamento |

**Exemplos:**
```bash
git commit -m "feat: adiciona endpoint de conteudos disponiveis para aluno"
git commit -m "fix: corrige dependencia de migration do forum"
git commit -m "docs: atualiza documento de integracao back-front"
```

---

## Regras importantes

- **Nunca** commitar diretamente na `main` ou `developer`
- **Nunca** subir o arquivo `.env`
- **Sempre** fazer `git pull origin developer` antes de criar uma branch nova
- **Sempre** vincular o PR a uma issue
- Migrations de turmas com erro de constraint `unique_aluno_turma` devem ter o `operations` esvaziado antes de subir

---

## Backend — boas práticas

- Toda mudança no banco exige migration — nunca alterar diretamente
- Usar `.distinct()` em queries com relações ManyToMany
- Permissões sempre verificadas nas views — nunca confiar só no frontend
- Serializers validam dados de entrada — campos obrigatórios, formatos, unicidade

---

## Frontend — boas práticas

- Toda comunicação com o backend via `services/`
- Nunca fazer chamadas diretas à API fora dos services
- Token JWT salvo no `localStorage` e enviado via header `Authorization: Bearer`
- Tratar erros de API com mensagens claras para o usuário
