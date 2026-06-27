
# Banco de Dados

> **SGBD:** PostgreSQL  
> **ORM:** Django ORM  
> **Migrations:** Gerenciadas pelo Django 

---

## Estrutura geral

O banco do GoStudy é organizado em 4 apps Django:

| App | Responsabilidade |
|-----|-----------------|
| `usuarios` | Perfis, autenticação e tipos de usuário |
| `disciplinas` | Disciplinas, conteúdos e materiais |
| `turmas` | Matrículas de alunos em conteúdos |
| `interacoes` | Inscrições, fórum, mensagens e denúncias |

---

## App `usuarios`

### Perfil
Model base de autenticação — usa `AbstractBaseUser` com login por email.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `email` | EmailField (unique) | Usado para autenticação |
| `nome` | CharField | Nome completo |
| `cpf` | CharField (unique) | CPF sem formatação |
| `data_nascimento` | DateField | Data de nascimento |
| `tipo` | CharField | `aluno`, `professor` ou `admin` |
| `is_active` | BooleanField | Conta ativa ou não |

### Aluno
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `perfil` | OneToOne → Perfil | Vínculo com o perfil base |

### Professor
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `perfil` | OneToOne → Perfil | Vínculo com o perfil base |
| `curriculo` | FileField | Currículo em PDF |

### Admin
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `perfil` | OneToOne → Perfil | Vínculo com o perfil base |

---

## App `disciplinas`

### Disciplina
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | CharField (unique) | Nome da disciplina |
| `descricao` | TextField | Descrição |
| `data_create` | DateTimeField | Data de criação |
| `data_update` | DateTimeField | Data de atualização |

### Conteudo
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `disciplina` | FK → Disciplina | Disciplina pai |
| `professores` | M2M → Professor | Professores responsáveis |
| `nome` | CharField (unique) | Nome do conteúdo |
| `descricao` | TextField | Descrição |
| `status` | CharField | `ativo` ou `encerrado` |
| `data_create` | DateTimeField | Data de criação |
| `data_update` | DateTimeField | Data de atualização |

### Material
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `conteudo` | FK → Conteudo | Conteúdo pai |
| `nome` | CharField | Nome do material |
| `descricao` | TextField | Descrição |
| `tipo` | CharField | `pdf`, `video`, `imagem`, `link`, `apresentacao`, `documento` |
| `arquivo` | FileField | Arquivo enviado |
| `link` | URLField | Link externo |
| `data_create` | DateTimeField | Data de criação |
| `data_update` | DateTimeField | Data de atualização |

---

## App `turmas`

### Matricula
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `aluno` | FK → Aluno | Aluno matriculado |
| `conteudo` | FK → Conteudo | Conteúdo matriculado |
| `matriculado_em` | DateTimeField | Data da matrícula |

---

## App `interacoes`

### Inscricao
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `professor` | FK → Professor | Professor candidato |
| `status` | CharField | `pendente`, `aprovado` ou `recusado` |
| `descricao` | TextField | Observações |
| `analisado_por` | FK → Admin | Admin que analisou |
| `analisado_em` | DateTimeField | Data da análise |
| `data_create` | DateTimeField | Data de criação |

### Forum
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `conteudo` | OneToOne → Conteudo | Conteúdo ao qual o fórum pertence |
| `data_create` | DateTimeField | Data de criação |

> ⚠️ O fórum é criado automaticamente via Django signal quando um conteúdo é criado.

### Mensagem
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `forum` | FK → Forum | Fórum ao qual pertence |
| `autor` | FK → Perfil | Autor da mensagem |
| `resposta_para` | FK → Mensagem (self) | Mensagem respondida (null se for pergunta) |
| `texto` | TextField | Conteúdo da mensagem |
| `data_create` | DateTimeField | Data de criação |
| `data_update` | DateTimeField | Data de atualização |

### Denuncia
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `mensagem` | FK → Mensagem | Mensagem denunciada |
| `denunciante` | FK → Perfil | Quem fez a denúncia |
| `denunciado` | FK → Perfil | Quem foi denunciado |
| `motivo` | CharField | Motivo da denúncia |
| `evidencias` | TextField | Evidências apresentadas |
| `parecer_admin` | TextField | Parecer do administrador |
| `analisado_por` | FK → Admin | Admin que analisou |
| `status` | CharField | `pendente`, `aprovado` ou `recusado` |

---

## Relacionamentos principais

```
Perfil (1) ──── (1) Aluno
Perfil (1) ──── (1) Professor
Perfil (1) ──── (1) Admin

Disciplina (1) ──── (N) Conteudo
Conteudo (N) ──── (N) Professor
Conteudo (1) ──── (N) Material
Conteudo (1) ──── (1) Forum
Conteudo (1) ──── (N) Matricula

Forum (1) ──── (N) Mensagem
Mensagem (1) ──── (N) Mensagem [respostas]

Aluno (1) ──── (N) Matricula
Professor (1) ──── (N) Inscricao
Mensagem (1) ──── (N) Denuncia
```

---

## Regras importantes

- Não alterar o banco diretamente — sempre via migrations
- Toda mudança estrutural exige `python manage.py makemigrations` + `python manage.py migrate`
- O campo `nome` de `Conteudo` é único globalmente
- O fórum é criado automaticamente — não criar manualmente
- Mensagens com denúncia pendente não podem ser editadas ou deletadas
