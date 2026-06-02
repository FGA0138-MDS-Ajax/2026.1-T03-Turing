# Documentação de Testes 
 
**Projeto:** GoStudy  
**Equipe:** P.O, Desenvolvedores e Cliente  
**Ferramenta de testes automatizados:** Django REST Framework — `APITestCase`

## Estrutura dos testes automatizados
 
Os testes foram implementados com `APITestCase` do Django REST Framework, usando `setUpTestData` para criação compartilhada de fixtures e autenticação JWT via endpoint `/api/usuarios/login/`.
Eles se encontram em cada pasta do backend, e são atualizados a cada sprint

---
 
## Sumário
 
1. [Sprint 1 — Cadastro e Autenticação](#sprint-1)
2. [Sprint 2 — Administração](#sprint-2)
3. [Sprint 3 — Matrículas](#sprint-3)
4. [Requisitos Funcionais e Não Funcionais](#requisitos)
5. [Casos de Teste](#casos-de-teste)
---
 
## Sprint 1 — Cadastro e Autenticação {#sprint-1}
 
**Período:** 04/05/2026 a 14/05/2026 (com atraso de 2 dias)
**Escopo:** Sistema de cadastro de alunos, professores e administradores com autenticação.  
**Responsáveis:** P.O e Cliente  
**Critério de progresso:** Intervalos mínimos de 10 em 10%
 
### O que foi testado
 
Os testes desta sprint cobriram o fluxo completo de cadastro e login de todos os tipos de perfil. Os testes de sistema foram realizados manualmente via front-end.
 
| ID | Teste | Tipo | Resultado Esperado |
|----|-------|------|--------------------|
| T01 | Cadastro de aluno | Sistema / Funcional | Conta criada com sucesso |
| T02 | Validação dos dados do usuário | Unitário / Funcional | Erro de validação para dados inválidos |
| T03 | Login com credenciais válidas | Sistema / Funcional | Acesso concedido |
| T04 | Login inválido | Sistema / Funcional | Acesso negado |
| T05 | Autenticação interna | Unitário / Funcional | Retorno correto da função |
| T06 | Cadastro de professor (envio de currículo) | Sistema / Funcional | Cadastro restrito concluído |
| T07 | Login de administrador padrão | Sistema / Funcional | Login bem-sucedido com credenciais padrão |
 
---
 
## Sprint 2 — Administração {#sprint-2}
 
**Período:** 09/05/2026 a 19/05/2026  
**Escopo:** Módulo de gerenciamento interno com permissões de administrador.  
**Responsáveis:** P.O e Desenvolvedores
 
### O que foi testado
 
Foco em operações administrativas: gerenciamento de perfis, aprovação de professores e manutenção de conteúdos/disciplinas. CRUDs conferidos via testes automatizados; testes de sistema foram manuais.
 
| ID | Teste | Tipo | Resultado Esperado |
|----|-------|------|--------------------|
| T08 | Gerenciamento de perfis (alterar usuário) | Sistema / Funcional | Alteração realizada e persistida |
| T09 | Aprovação de professores | Sistema / Funcional | Aprovação concluída |
 
---
 
## Sprint 3 — Matrículas {#sprint-3}
 
**Período:** Em andamento  
**Escopo:** Módulo de matrículas: criar, listar e deletar matrículas por perfil (admin, aluno, professor).
 


 
## Requisitos Funcionais e Não Funcionais {#requisitos}
 
### Sprint 1
 
| ID | Tipo | Prioridade | Descrição |
|----|------|------------|-----------|
| Ce1/RF1 | Funcional | Must | Cadastro de aluno com email, senha, CPF, data de nascimento e nome completo |
| Ce1/RF2 | Funcional | Must | Login com email e senha para professor, aluno e admin |
| Ce1/RF3 | Funcional | Must | Cadastro de professor com acesso restrito ao envio de currículo |
| Ce1/RF4 | Funcional | Must | Conta de admin pré-cadastrada (username: admin123 / senha: @admin123) |
| Ce1/RF27 | Funcional | Could | Envio de email de confirmação ao professor com login aprovado |
| Ce1/RF27.1 | Funcional | Could | Notificação por email ao professor (nova pergunta no fórum) e ao aluno (resposta recebida) |
| Ce1/RNF1 | Não Funcional | Must | Conexão com banco de dados para persistência de dados |
| Ce1/RNF2 | Não Funcional | Must | Email e senha persistidos com criptografia segura |
| Ce1/RNF3 | Não Funcional | Should | Sistema de fácil compreensão para usuários leigos |
| Ce1/RNF4 | Não Funcional | Must | Módulo de cadastro disponível 24/7 |
| Ce1/RNF5 | Não Funcional | Must | Compatibilidade com a última versão dos principais navegadores |
| Ce1/RNF6 | Não Funcional | Should | Sistema responsivo em diferentes dispositivos |
 
### Sprint 2
 
| ID | Tipo | Prioridade | Descrição |
|----|------|------------|-----------|
| Ce2/RF5 | Funcional | Must | Gerenciamento de perfis: criar, alterar e deletar qualquer tipo de perfil |
| Ce2/RF6 | Funcional | Must | Aprovação de currículo de professores pelo administrador |
| Ce2/RF7 | Funcional | Must | Módulo de análise e homologação de denúncias |
| Ce3/RF8 | Funcional | Must | Manutenção de conteúdos/disciplinas pelo administrador |
 
---
 
## Casos de Teste {#casos-de-teste}
 
| ID | Nome | Abordagem | Tipo | Pré-condição | Resultado Esperado |
|----|------|-----------|------|--------------|-------------------|
| T01 | Cadastro de aluno | Sistema | Funcional | Usuário não cadastrado | Conta criada com sucesso |
| T02 | Validação dos dados do usuário | Unitário | Funcional | Dados inválidos | Erro de validação |
| T03 | Login com credenciais válidas | Sistema | Funcional | Usuário previamente cadastrado | Acesso concedido |
| T04 | Login inválido | Sistema | Funcional | Usuário previamente cadastrado | Acesso negado |
| T05 | Autenticação interna | Unitário | Funcional | Usuário existente | Retorno correto |
| T06 | Cadastro de professor | Sistema | Funcional | Professor não cadastrado | Cadastro restrito concluído |
| T07 | Login de administrador padrão | Sistema | Funcional | Credenciais padrão configuradas | Login bem-sucedido |
| T08 | Gerenciamento de perfis | Sistema | Funcional | Usuário existente | Alteração realizada e persistida |
| T09 | Aprovação de professores | Sistema | Funcional | Professor com cadastro pendente | Aprovação concluída |
| T10 | Criar matrícula (admin) | Automatizado | Funcional | Admin autenticado, conteúdo ativo | HTTP 201 |
| T11 | Listar matrículas (admin) | Automatizado | Funcional | Admin autenticado | HTTP 200, lista |
| T12 | Deletar matrícula (admin) | Automatizado | Funcional | Matrícula existente | HTTP 204 |
| T13 | Matrícula em conteúdo encerrado (admin) | Automatizado | Funcional | Conteúdo com status encerrado | HTTP 400 |
| T14 | Criar matrícula (aluno — própria) | Automatizado | Funcional | Aluno autenticado, conteúdo ativo | HTTP 201 |
| T15 | Listar matrículas (aluno) | Automatizado | Funcional | Aluno autenticado | HTTP 200, lista filtrada |
| T16 | Deletar própria matrícula (aluno) | Automatizado | Funcional | Matrícula do aluno existente | HTTP 204 |
| T17 | Deletar matrícula de outro aluno | Automatizado | Funcional | Matrícula de terceiro existente | HTTP 404 |
| T18 | Matrícula em conteúdo encerrado (aluno) | Automatizado | Funcional | Conteúdo com status encerrado | HTTP 400 |
| T19 | Criar matrícula passando aluno terceiro | Automatizado | Funcional | Aluno autenticado | HTTP 201 |
| T20 | Listar matrículas (professor) | Automatizado | Funcional | Professor autenticado | HTTP 200, lista |
 
---
 
*Documentação gerada com base nos testes implementados até a Sprint 3.*
*Última atualização: 02/06/2026*