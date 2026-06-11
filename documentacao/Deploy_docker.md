# 🐳 Rodando o projeto com Docker
 
## Pré-requisitos
 
- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/) (já incluso no Docker Desktop)
---
 
## Estrutura esperada
 
```
projeto/
├── backend/
│   ├── Dockerfile
│   ├── .env.docker
│   └── ...
├── frontend/
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml
```
 
---
 
## 1. Configure as variáveis de ambiente
 
Crie o arquivo `backend/.env.docker` com o seguinte conteúdo:
 
```env
SECRET_KEY=sua_secret_key_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=gostudy
DB_USER=<usuario do banco>
DB_PASSWORD=<senha do banco>
DB_HOST=db
DB_PORT=5432
```
 
> ⚠️ **Atenção:** o `DB_HOST` deve ser `db` (nome do serviço no compose), e não `localhost`.
 
---
 
## 2. Suba os containers
 
Na **raiz do projeto**, rode:
 
```bash
docker compose up --build
```
 
Na primeira execução o `--build` é obrigatório para construir as imagens. Nas próximas, pode usar apenas:
 
```bash
docker compose up
```

Para parar o software (preservando os dados)

````bash
docker compose stop
````
 
Para rodar novamente após parado(buscando os dados)

````bash
docker compose start
````
---
 
## 3. Acesse a aplicação
 
| Serviço  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |
| Banco    | localhost:5432        |
 
---
 
## Comandos úteis
 
### Subir em background
```bash
docker compose up -d
```
 
### Ver logs
```bash
docker compose logs -f
```
 
### Ver logs de um serviço específico
```bash
docker compose logs -f backend
```
 
### Parar os containers (preserva dados)
```bash
docker compose stop
```
 
### Derrubar os containers (preserva dados)
```bash
docker compose down
```
 
### Derrubar e apagar o banco (reset completo)
```bash
docker compose down -v
```
 
### Rodar um comando dentro do container
```bash
docker compose exec backend python manage.py <comando>
```
 
---
 
## Migrações
 
As migrações rodam automaticamente ao subir o backend. Se precisar rodar manualmente:
 
```bash
docker compose exec backend python manage.py migrate
```

## Problemas comuns
 
### `failed to resolve host 'db'`
Você está rodando o compose fora da raiz do projeto. Navegue até a raiz e tente novamente:
```bash
cd caminho/para/a/raiz
docker compose up
```
 
### `port is already allocated`
A porta `5432` já está em uso por outro container. Pare o banco local:
```bash
docker stop postgre_go_study
```
 
### `password authentication failed`
As credenciais do `.env.docker` não batem com o volume existente. Faça um reset completo:
```bash
docker compose down -v
docker compose up
```