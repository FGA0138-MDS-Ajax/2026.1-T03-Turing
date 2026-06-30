#  <img src="/documentacao/assets/logo_gostudy.png" width="100"> GoStudy

## Sobre o Projeto

O GoStudy é uma plataforma voltada para auxiliar estudantes e professores no gerenciamento e compartilhamento de conteúdos acadêmicos.

Desenvolvido na disciplina de Métodos de Desenvolvimento de Software (MDS), o projeto segue práticas de desenvolvimento colaborativo, integração contínua, controle de versões e metodologias ágeis.

---

## 👥 Equipe


<div align="center">

<table>
<tr>

<td align="center" width="180px">
<a href="https://github.com/gabriel-otacilio">
<img src="https://github.com/gabriel-otacilio.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Gabriel Octacilio</b>
</a>
<br>
<sub>	P.O</sub>
</td>

<td align="center" width="180px">
<a href="https://github.com/Zayra-Moraes">
<img src="https://github.com/Zayra-Moraes.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Zayra Moraes</b>
</a>
<br>
<sub>Analista de qualidade</sub>
</td>

<td align="center" width="180px">
<a href="https://github.com/LuizGustavoved">
<img src="https://github.com/LuizGustavoved.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Luiz Gustavo</b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center" width="180px">
<a href="https://github.com/Arthur061">
<img src="https://github.com/Arthur061.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>	Arthur Alves </b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center" width="180px">
<a href="https://github.com/Clarice-gg">
<img src="https://github.com/Clarice-gg.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Clarice Gitirana</b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center" width="180px">
<a href="https://github.com/luanaa2005">
<img src="https://github.com/luanaa2005.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Luana Carvalho</b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

</tr>

<tr>

<td align="center">
<a href="https://github.com/luisa5r">
<img src="https://github.com/luisa5r.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Luísa de Souza</b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center">
<a href="https://github.com/mejg">
<img src="https://github.com/mejg.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Maria Eduarda</b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center">
<a href="https://github.com/thiagoHenrique12">
<img src="https://github.com/thiagoHenrique12.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Thiago Henrique </b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center">
<a href="https://github.com/ArthurziEvan">
<img src="https://github.com/ArthurziEvan.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>Arthur Evangelista </b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

<td align="center">
<a href="https://github.com/Jvezyk">
<img src="https://github.com/Jvezyk.png" width="100px;" style="border-radius:50%" alt="Nome"/>
<br><br>
<b>João Vitor Justo </b>
</a>
<br>
<sub>Desenvolvedor</sub>
</td>

</tr>
</table>

</div>
---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React
- Vite

### Backend
- Django
- Django REST Framework

### Banco de Dados
- PostgreSQL

### Ferramentas
- Git
- GitHub
- Figma
- MkDocs

---

## 🌳 Estratégia de Branches

O projeto segue uma estratégia de desenvolvimento baseada em ambientes separados para documentação, desenvolvimento, testes e produção.

### Main
Branch destinada à versão estável e pronta para produção.

### Developer
Branch utilizada para:

- Desenvolvimento das funcionalidades
- Correções de bugs
- Implementação de testes
- Integração das features da equipe

Após validação, as alterações são encaminhadas para a branch de testes.

### Testes

Ambiente destinado à validação do sistema.

Nesta branch são realizados:

- Testes de unitários
- Testes funcionais
- Validação das funcionalidades implementadas

Após aprovação dos testes, as alterações podem ser promovidas para produção.

### Docs

Responsável pelo armazenamento da documentação do projeto.

### gh-pages

Responsável pelo deploy automático da documentação gerada pelo MkDocs.

---

## 🔄 Fluxo de Desenvolvimento

```text
Feature Branch
      ↓
Developer
      ↓
Testes
      ↓
Main
```

### Processo

1. Desenvolvimento da funcionalidade
2. Merge para `developer`
3. Execução dos testes
4. Deploy para ambiente de testes
5. Validação da equipe
6. Merge para `main`

---

## 📚 Documentação

A documentação do projeto é construída utilizando:

- MkDocs
- Material for MkDocs

### Deploy da documentação

A documentação é publicada automaticamente através do GitHub Pages.

Configuração necessária:

1. Acessar Settings do repositório
2. Selecionar Pages
3. Escolher:
   - Source → Deploy from a branch
   - Branch → gh-pages
4. Salvar

---

## 🏗️ Arquitetura

```text
Frontend (React)
       ↓
API REST
       ↓
Backend (Django)
       ↓
PostgreSQL
```

---

## 📂 Estrutura do Projeto

| Diretório       | Descrição                                       |
|-----------------|-------------------------------------------------|
| `frontend/`     | Interface web desenvolvida em React             |
| `backend/`      | API e regras de negócio desenvolvidas em Django |
| `documentacao/` | Documentação do projeto e padronização          |
| `mkdocs.yml`    | Configuração do MkDocs                          |
| `README.md`     | Documento principal do projeto                  |

---

## 📅 Sprints

| Sprint   | Objetivo                                        | Status |
|----------|-------------------------------------------------|---------|
| Sprint 1 | Cadastro de alunos, professores e administrador | ✅ |
| Sprint 2 | Administração                                   | ✅ |
| Sprint 3 | Postagem de material                            | ✅  |
| Sprint 4 | Visualização e interação                        | ✅  |
| Sprint 5 | fórum                                           | 🚧 |
| Sprint 6 | Acessibilidade                                  | 🚧 |

---

## 🚀 Como Executar

### Backend

```bash
pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Rota: http://localhost:8000/

### Frontend

```bash
npm install

npm run dev
```

Rota: http://localhost:5173/
