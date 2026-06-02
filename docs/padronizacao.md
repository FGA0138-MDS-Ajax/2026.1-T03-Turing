# Documento de Padronização e Organização

## Objetivo 

Este documento define os padrões de desenvolvimento, integração e organização usados no projeto GoStudy. Seu objetivo é permitir que os membros da equipe desenvolvam as partes do sistema de forma paralela e modular, mantendo compatibilidade entre frontend, backend e banco de dados durante todo o processo de integração.  


## 1. Organização das branches 

#### 1.1 Estrutura de Branches:

O projeto utilizará as seguintes branches principais: 

- `main` -> versão estável e validada do sistema 
    
- `developer` -> integração das funcionalidades em desenvolvimento 
    
- `feature/*` -> desenvolvimento das funcionalidades completas específicas 
    
- `fix/*` -> correções e ajustes 

>branches de task poderão ser utilizadas apenas quando necessário e mediante acordo da equipe. 

#### 1.2 Padrão de nomeação 

As branches devem ser nomeadas de acordo com suas issues relacionadas 

Exemplos: 
* **Funcionalidades**:  feature/nome-da-feature 

* **Correções**: fix/nome-da-correcao 


## 2. Organização Interna e Responsabilidades

Para potencializar o desenvolvimento, as tarefas dentro das issues devem ser separadas por responsabilidade: 

1) FRONTEND : Interfaces, interações e responsividade.

2) BACKEND: Lógica interna, regras de negócio complexas e validação 

3) BANCO DE DADOS: Persistência, modelagem e relações entre entidades. 

4) TESTES/QA: Garantia de qualidade técnica e funcional. 

#### 2.1 Padrões de Código 

* **Nomenclatura:** Utilizar **snake_case** para variáveis, metodos e APIs.
    * **PascalCase** para classes
* **Consistência:** Os nomes de campos e entidades devem ser idênticos em todas as camadas (Front, Back e Banco).

#### 2.2 Padrões de Commit

* **feat:** Quando adicionarmos um novo recurso ao código

* **fix:** commit referente a correção de um bug

* **style:** Alterações que não afetam a lógica do código (formatação...) 

* **docs:** Mudanças apenas em documentação

* **test:** Adicionando ou corrigindo testes

As mensagens que se seguirem após essas nomeclaturas devem ser objetivas e descritivas

>**Exemplo:** git commit -m "docs: adiciona guia de padronização"



## 3. interface entre camadas (API REST)

O **GoStudy** utiliza uma arquitetura desacoplada onde a comunicação ocorre exclusivamente via **API REST**.

#### 3.1. Frontend ↔ Backend

- **Protocolo**: Comunicação realizada apenas através de **API REST**.

- **Formato**: Requests e respostas estritamente em **JSON**.

- **Padronização**: Nomes de campos devem permanecer consistentes entre o objeto enviado e o recebido.

- **Erros**: Respostas de erro devem seguir um formato padrão de mensagem.

**Exemplos de interface:***

* **Request :**
```Json
{ 
"email": "usuario@email.com",
 "senha": "123456" 
 }
```

* **Resposta Bem-sucedida:** 
```Json
{ 
"sucesso": true, 
"mensagem": "Login realizado com sucesso"
 }
```

* **Resposta de Erro:**
```Json
{
“sucesso”: false, 
“mensagem”: “senha inválida”
 }
```

#### 3.2. Backend ↔ Banco de Dados

- **Acesso**: Realizado exclusivamente através do **Django ORM**.

- **Schema**: Mudanças de estrutura devem passar obrigatoriamente por **Migrations**.

- **Modelagem**: Nomes de campos devem seguir os modelos específicos; FKs (Chaves Estrangeiras) e restrições devem ser respeitadas.

## 4. Regras de integração

Para garantir a qualidade técnica e funcional, as seguintes regras são imutáveis:

- O Frontend consome **apenas** os endpoints da API.

- O Backend retorna respostas processadas em **JSON**.

- **Toda validação** de regra de negócio deve residir na camada Backend.

- Alterações estruturais no banco de dados são feitas via Migrations.


## 5. organização dos arquivos: 

##### **Frontend (React + Bootstrap)**: 

- `components/` → componentes reutilizáveis 

- `pages/` → páginas principais do sistema 

- `services/` → comunicação com API 

- `styles/`→ estilos globais 

- `assets/`→ imagens e recursos visuais 

- `routes` → configuração de rotas 

- `contexts/` → gerenciamento de estados globais 

- `utils/` → funções auxiliares 

#####  **Backend (Django):** 

- **Modularidade**: Funcionalidades separadas em apps Django distintos.

- **Desacoplamento**: Regras de negócio complexas devem ser separadas das `views`.

- **Migrations**: Devem permanecer organizadas dentro da pasta de cada app.

- **Endpoints**: Devem seguir uma separação modular clara.


## 6. Fluxo do Github

O fluxo de desenvolvimento segue o ciclo:
**Issue** → **Branch de Feature** → **Pull Request** → **PR Review** → **Merge Develop** → **Teste** → **Merge Main**.

#### 6.1 Regras de versionamento

- **Branch Main**: Proibido realizar commits diretos.

- **Rastreabilidade**: Toda funcionalidade e todo PR devem estar vinculados a uma **Issue**.

- **Qualidade**: Todo código deve passar por revisão (Code Review) antes do merge.

- **Validação**: O merge para `main` só ocorre após validação completa e testes.

- **Sincronização**: Desenvolvedores devem atualizar suas branches frequentemente para evitar conflitos.


## 7. Definição de Pronto (DoD)

uma tarefa só é considerada completa de fato quando: 

1) O código está implementado.

2) A funcionalidade opera corretamente em ambiente local.

3) Não há conflitos de merge pendentes.

4) O PR está criado e devidamente vinculado à Issue.

5) O código foi aprovado na revisão por pares.

6) A funcionalidade passou pela validação de QA.


## 8. Padrões no Banco de Dados

- **Integridade**: Nomes de entidades devem ser consistentes em todo o código (Frontend, Backend e Banco).

- **Persistência**: Nenhuma mudança direta no banco é permitida; tudo deve ser registrado via **Migration** do Django ORM.


## 9. Expectativas nos testes

#### 9.1 Expectativas técnicas 

- **Local**: Desenvolvedores devem testar localmente antes de abrir um PR (o código não deve estar quebrado).

- **Documentação**: Scripts de teste devem ser documentados na branch correspondente.

- **Critérios de Aceite**: O QA valida os testes baseando-se nos critérios definidos no planejamento.

#### 9.2 Tratamento de Erros HTTP 

- **400**: Input inválido (Erro de validação).

- **401**: _Unauthorized_ (Usuário não autenticado).

- **403**: Proibido (Usuário sem permissão para o recurso).

- **404**: _Not Found_ (Recurso inexistente).

- **500**: _Unexpected Server Error_ (Falha crítica no servidor).

são usados tanto para a lógica quanto para o comportamento do frontend quando encontra alguma dessas situações
