# Setup do Ambiente

## Pré-requisitos

Antes de iniciar o projeto, instale na sua máquina:

- Git
- Python 3.12 (versões 3.13+ têm problemas de compatibilidade com algumas dependências)
- PostgreSQL
- Node.js

> Se já tiver outra versão do Python instalada, não tem problema — as versões coexistem normalmente. Só instale a 3.12 e garanta que o PATH está configurado corretamente.

---

## Configuração inicial do Backend

### 1. Criar o banco de dados

Abra o pgAdmin e crie um banco PostgreSQL com o nome `gostudy`.

### 2. Clonar o repositório

```bash
git clone <url-do-repo>
```

### 3. Entrar na pasta backend

```bash
cd backend
```

### 4. Criar ambiente virtual Python

Verifique a versão do Python:

```bash
python --version
```

Crie o ambiente virtual:

```bash
py -3.12 -m venv venv
```

### 5. Ativar o ambiente virtual

**Windows:**
```bash
venv/Scripts/activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

> Sempre confirme que a `(venv)` aparece no terminal após ativar.

### 6. Instalar dependências

```bash
pip install -r requirements.txt
```

### 7. Criar o arquivo .env

```bash
cp .env.example .env
```

### 8. Configurar credenciais do banco

Abra o arquivo `.env` e altere:

- `DB_USER` — usuário do PostgreSQL
- `DB_PASSWORD` — senha do PostgreSQL

### 9. Executar migrations

```bash
python manage.py migrate
```

### 10. Iniciar servidor backend

```bash
python manage.py runserver
```

O backend ficará disponível em `http://localhost:8000/`

---

## Configuração inicial do Frontend

### 1. Entrar na pasta frontend

```bash
cd frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:5173/`

---

## Rotina diária

### Backend

```bash
cd backend
venv/Scripts/activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm run dev
```

> Backend e frontend precisam estar rodando simultaneamente para o sistema funcionar.

---

## Observações importantes

- O arquivo `.env` *não deve ser commitado
- Se novas dependências forem adicionadas: `pip install -r requirements.txt`
- Se novas migrations forem adicionadas: `python manage.py migrate`
- Se novos pacotes frontend forem adicionados: `npm install`