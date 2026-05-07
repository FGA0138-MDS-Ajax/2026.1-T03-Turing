# Go Study MDS 2026.1 — Django + React

API REST em Django + SPA em React (Vite).

---

## Requisitos

| Ferramenta | Versão | Download |
|---|---|---|
| Python | 3.12+ | https://python.org/downloads |
| Node.js | 20 LTS | https://nodejs.org |
| Git | qualquer | https://git-scm.com |

> Windows: durante a instalação do Python, marque **"Add Python to PATH"**.

---

## Setup — Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

---

## Setup — Frontend

Abra um **novo terminal**:

```powershell
cd frontend
npm install
npm run dev
```

---

## URLs

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000/api |
| Admin Django | http://localhost:8000/admin |

---

## Variáveis de ambiente

Copie o `.env.example` para `.env` dentro da pasta `backend/` e preencha os valores.
Nunca commite o arquivo `.env`.