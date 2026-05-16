# Setup do ambiente

## Pré requisitos

Antes de iniciar o projeto e clonar o repositório, é preciso ter instalado na máquina local:
- Git
- Python 3.12 (vamos padronizar especificamente essa versão; versões 3.13+ atualmente apresentam problemas de compatibilidade com algumas dependências do projeto)
Se já existir outra versão do Python instalada, não tem problema. as versões podem coexistir normalmente. só instalar também a 3.12 e garantir que o PATH foi configurado corretamente.
- PostgreSQL
- Node.js

## Configuração inicial do projeto
para um primeiro uso

1. Criar o banco de dados

Abrir o pgAdmin e criar um banco PostgreSQL com o nome
`gostudy`

2. Clonar repositório

Abrir o terminal no vscode dentro da pasta onde o projeto ficará, e executar:
`git clone <url-do-repo>`

3. entrar na pasta backend:
`cd backend`

4. Criar ambiente virtual Python
vamos usar a venv para lidar com credenciais e o gerenciamento de desenvolvimento local
no mesmo terminal, primeiro verifique a versão do python com:
`python --version`
e garanta que a versão 3.12 está sendo utilizada. se sim, crie o ambiente virtual:
`py -3.12 -m venv venv`

4. Ativar o ambiente virtual
isso vai ativar o ambiente virtual do python para o desenvolvimento. sempre confiram se a (venv) está no terminal após ativar
`venv/Scripts/activate`

5. Instalar dependências
`pip install -r requirements.txt`

6. Criar o arquivo .env na máquina local
`cp .env.example .env`
alternativamente, pode copiar manualmente o arquivo `.env.example` e renomear para `.env`

7. Configurar credenciais do banco
abrir o novo arquivo .env criado e alterar:
`DB_USER` para o usuário correto
`DB_PASSWORD` para a senha
após editar, salvar o arquivo .env

8. Executar migrations
de volta ao terminal:
`python manage.py migrate`
isso vai criar as tabelas locais no banco de dados a partir dos scripts migrations modelados e implementados

9. Iniciar servidor backend
`python manage.py runserver`
isso vai deixar o backend disponível localmente na porta indicada no terminal. pra executar comandos git ou python enquanto o servidor estiver rodando, abra um novo terminal no vscode e mantenha esse terminal do servidor aberto


## Rotina diária de uso do projeto

Sempre que abrir o projeto de novo

1. Abrir terminal na pasta backend
`cd backend`

2. Ativar ambiente virtual
`venv/Scripts/activate`

3. Iniciar servidor
`python manage.py runserver`

caso preciso, verifiquem a versão do python para garantir que não haverá problemas de compatibilidade

## Observações importantes

- o arquivo .env **não deve** ser enviado para o github
- caso novas dependências sejam adicionadas ao projeto, executar novamente:
`pip install -r requirements.txt`
- caso novas migrations sejam adicionadas por outros membros da equipe, executar novamente:
`python manage.py migrate`