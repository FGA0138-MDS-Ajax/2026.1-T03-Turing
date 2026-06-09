# [Ce4/RF9] Implementar  endpoints de Postagem de Conteúdo — Back-end
 
## Descrição geral
  
A implementação será responsável pela criação do model `Material`, relacionamentos com `Conteudo` (Turmas), serializers, viewsets e rotas da API, garantindo persistência correta no PostgreSQL  que **ja foi feito !!! Não façam denovo!!**

E futura implementação com o frontend **(vou lançar separado)**
 
O fluxo é: uma `Disciplina` possui `Conteudos`, cada `Conteudo` possui seus `Materiais`. O professor deve conseguir postar materiais associados a disciplinas/turmas.
 
---
 
## Banco de dados
 
- [x] Implementar entidade `Material` utilizando Django ORM
- [x] Configurar relacionamento entre `Conteudo` e `Material`
- [ ] Implementar choices para os tipos de materiais (`PDF`, `VIDEO`, `IMAGEM`, `LINK_EXTERNO`,`FORMULARIO`)(ir pra implementação front)
    - Adaptar oque foi feito na Sprint passada
- [x] Implementar validações estruturais dos campos
- [ ] Configurar `null`, `blank` e `default` corretamente
      - Verificar se os campos estao como NN ou blank corretamente 
- [ ] Gerar migrations com `makemigrations` **se necessario**
- [ ] Executar migrations no PostgreSQL **se necessario, avisar no grupo**
---
 
## API / Endpoints
 
- [ ] Verificar `MaterialSerializer` com validação de campos
     -  se nao tiver criar sub-issue pra faze-lo
- [x] Criar `MaterialViewSet` com as actions: `list`, `retrieve`, `create`, `update`, `destroy`
- [x] Registrar rotas no `router` da aplicação
- [ ] Filtrar materiais por `conteudo` (query param `?conteudo=<id>`)
    -  Se nao tiver criado, criar opção de filtrar por conteudo, professor, tipo e disciplina. 
- [ ] Retornar erro adequado caso `arquivo` e `link` sejam enviados simultaneament. Se nao tiver fazer regra de negocio pra tal. 
    -  verificar se existe esse erro
- [ ] Proteger endpoints com autenticação (apenas professor e admin pode criar/editar/deletar)
---
 
## Regras de negócio
 
- [ ] Um conteúdo pode possuir vários materiais
- [ ] Um material deve obrigatoriamente estar associado a um conteúdo
- [ ] O nome do material não pode ser vazio
- [ ] O tipo do material deve ser válido dentro das opções permitidas
- [ ] Materiais devem aceitar armazenamento de link externo **ou** arquivo, não ambos simultaneamente
- [ ] Garantir integridade referencial entre `Conteudo` e `Material`
- [ ] Apenas professores autenticados podem criar, editar e deletar materiais
- [ ] Alunos podem apenas visualizar materiais dos conteudos aos quais pertencem
---
 
## Critérios de conclusão
 
- [x] Entidade `Material` implementada corretamente no Django ORM
- [x] Relacionamentos funcionando corretamente
- [x] Migrations executando sem inconsistências
- [x] Persistência funcionando corretamente no PostgreSQL
- [x] Endpoints de listagem e criação de materiais funcionando
- [ ] Filtros por `conteudo` e por `disciplina/turma` funcionando
- [ ] Validações de negócio aplicadas no serializer
- [ ] Entidade pronta para uso nos endpoints futuros e integração com front-end
---
 
## Referências
 
| ID | Requisito | Prioridade | Descrição |
|---|---|---|---|
| Ce4/RF9 | Postagem de conteúdo | Must | O sistema deve disponibilizar opções de postagem ao professor, por disciplinas/turmas |
 
> **Sprint 3** — Postagem de material: módulo de postar conteúdo na plataforma
> **Período:** 28/05/2026 – 06/06/2026
> **Responsáveis:** Desenvolvedores e qualidade