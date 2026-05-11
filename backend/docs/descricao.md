# Banco de Dados — GoStudy

## O que foi feito

- PostgreSQL instalado e configurado
- Banco `gostudy` criado localmente
- Django conectado ao banco via `config/settings.py`
- Migrations iniciais rodadas com sucesso
- Apps criados e registrados no `settings.py`:
  - `usuarios` ✅ models prontas
  - `disciplinas` 🔄 em desenvolvimento
  - `turmas` 🔄 em desenvolvimento
  - `interacoes` 🔄 em desenvolvimento

---

## Como configurar o banco na sua máquina

> Siga os passos abaixo na ordem. Os comandos são para Ubuntu/Linux.

### 1. Instalar o PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib
```

### 2. Iniciar o serviço

```bash
sudo systemctl start postgresql
```

### 3. Criar o banco e definir a senha

```bash
sudo -u postgres psql
```

Dentro do PostgreSQL, rode:

```sql
ALTER USER postgres PASSWORD 'turing';
CREATE DATABASE gostudy;
\q
```

### 4. Instalar as dependências do projeto

Na pasta `backend`:

```bash
pip install -r requirements.txt
```

### 5. Configurar o `settings.py`

Abra o arquivo `config/settings.py` e substitua o bloco `DATABASES` por:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'gostudy',
        'USER': 'postgres',
        'PASSWORD': 'turing',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

> ⚠️ **Atenção:** nunca suba o `settings.py` com senha para o GitHub!

### 6. Rodar as migrations

```bash
python3 manage.py migrate
```

### 7. Verificar a conexão

```bash
python3 manage.py dbshell
```

Se abrir o prompt `gostudy=#` sem erros, está tudo funcionando.

---

## Estrutura dos apps

| App | Responsabilidade | Status |
|---|---|---|
| `usuarios` | Perfil, Aluno, Professor, Admin | ✅ Pronto |
| `disciplinas` | Disciplina, DisciplinaPrerequisito, Conteudo, Material, ProfessorConteudo | 🔄 Em desenvolvimento |
| `turmas` | Matricula, Forum | 🔄 Em desenvolvimento |
| `interacoes` | Inscricao, Denuncia, Pergunta, Resposta, Avaliacoes | 🔄 Em desenvolvimento |

---

## Próximos passos

### Sprint atual (prioridade alta)
- [ ] Escrever `disciplinas/models.py` → tabela `Disciplina`
- [ ] Escrever `interacoes/models.py` → tabela `Inscricao`
- [ ] Rodar `makemigrations` e `migrate` para os novos apps
- [ ] Implementar endpoints de cadastro de usuários via API REST

### Próximas sprints
- [ ] Completar models de `turmas` → `Matricula` e `Forum`
- [ ] Completar models restantes de `interacoes` → `Denuncia`, `Pergunta`, `Resposta`, `Avaliacoes`
- [ ] Completar models de `disciplinas` → `DisciplinaPrerequisito`, `Conteudo`, `Material`, `ProfessorConteudo`
- [ ] Implementar autenticação (login/logout) com controle de permissões por perfil

---

## Fluxo de criação de uma nova model

Sempre que for criar uma nova tabela:

```bash
# 1. Escrever a classe no models.py do app correspondente

# 2. Gerar a migration
python3 manage.py makemigrations nome_do_app

# 3. Aplicar a migration no banco
python3 manage.py migrate
```

---

## Diagrama do banco

O diagrama de entidade-relacionamento completo está disponível no arquivo `MDS_Go_Study.pdf` na raiz do repositório.