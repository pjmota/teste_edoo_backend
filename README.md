# API de Gerenciamento de Benefícios

Este projeto é uma API backend desenvolvida com NestJS para gerenciar benefícios. Ele oferece funcionalidades CRUD (Criar, Ler, Atualizar, Deletar) para benefícios, além de opções para ativar e desativar benefícios. A API inclui documentação interativa via Swagger e métricas de monitoramento com `prom-client`.

## Tecnologias Utilizadas

- **NestJS**: Um framework progressivo para construir aplicações Node.js eficientes e escaláveis.
- **TypeScript**: Uma linguagem de programação que se baseia em JavaScript, adicionando tipagem estática.
- **Sequelize**: Um ORM (Object-Relational Mapper) para Node.js, utilizado para interagir com o banco de dados SQLite.
- **Swagger**: Para documentação interativa da API.
- **Prom-client**: Para coleta de métricas de monitoramento.
- **SQLite3**: Banco de dados leve e embarcado.

## Funcionalidades

A API oferece os seguintes endpoints para gerenciamento de benefícios:

### Benefícios

- `GET /benefits`: Lista todos os benefícios com paginação opcional.
- `GET /benefits/:id`: Retorna um benefício específico pelo ID.
- `POST /benefits`: Cria um novo benefício.
- `PUT /benefits/:id`: Atualiza um benefício existente pelo ID.
- `PUT /benefits/:id/deactivate`: Desativa um benefício pelo ID.
- `PUT /benefits/:id/activate`: Ativa um benefício pelo ID.
- `DELETE /benefits/:id`: Remove um benefício pelo ID.

### Métricas

- `GET /metrics`: Retorna métricas de monitoramento da aplicação.

## Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente:

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd teste_edoo_backend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

    ```env
    PORT=3000
    DATABASE_URL="sqlite://:memory:"
    ```

    *   `PORT`: Porta em que a API será executada (padrão: 3000).
    *   `DATABASE_URL`: URL de conexão com o banco de dados. Para SQLite em memória, use `sqlite://
    ```

4.  **Execute o projeto:**

    ```bash
    npm run start:dev
    # ou
    yarn start:dev
    ```

    A API estará disponível em `http://localhost:3000` (ou na porta configurada).

5.  **Acesse a documentação Swagger:**

    A documentação interativa da API estará disponível em `http://localhost:3000/api`.

## Scripts Disponíveis

- `npm run build`: Compila o projeto TypeScript para JavaScript.
- `npm run format`: Formata o código com o Prettier.
- `npm run start`: Inicia a aplicação em modo de produção.
- `npm run start:dev`: Inicia a aplicação em modo de desenvolvimento com watch.
- `npm run start:debug`: Inicia a aplicação em modo de depuração.
- `npm run lint`: Executa o linter para análise de código.
- `npm test`: Executa os testes unitários.
- `npm run test:cov`: Gera o relatório de cobertura de testes.
- `npm run test:e2e`: Executa os testes end-to-end.

## Estrutura do Projeto

A estrutura de pastas do projeto segue o padrão do NestJS:

```
/src
|-- /controllers       # Controladores da API
|-- /DTOs              # Data Transfer Objects
|-- /models            # Modelos de dados (Sequelize)
|-- /services          # Lógica de negócio
|-- /mocks             # Mocks para testes
|-- /types             # Tipos e interfaces
|-- app.module.ts      # Módulo principal da aplicação
|-- main.ts            # Ponto de entrada da aplicação
```

## Testes

O projeto inclui testes unitários e end-to-end. Para executá-los, utilize os seguintes comandos:

- **Testes Unitários:**
  ```bash
  npm test
  ```

- **Testes End-to-End:**
  ```bash
  npm run test:e2e
  ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença UNLICENSED.




## Rotas da API

A API expõe as seguintes rotas:

| Método HTTP | Rota                 | Descrição                                    |
| :---------- | :------------------- | :------------------------------------------- |
| `GET`       | `/benefits`          | Lista todos os benefícios com paginação opcional. |
| `GET`       | `/benefits/:id`      | Retorna um benefício específico pelo ID.     |
| `POST`      | `/benefits`          | Cria um novo benefício.                      |
| `PUT`       | `/benefits/:id`      | Atualiza um benefício existente pelo ID.     |
| `PUT`       | `/benefits/:id/deactivate` | Desativa um benefício pelo ID.               |
| `PUT`       | `/benefits/:id/activate`   | Ativa um benefício pelo ID.                  |
| `DELETE`    | `/benefits/:id`      | Remove um benefício pelo ID.                 |
| `GET`       | `/api`               | Documentação interativa da API (Swagger UI). |
| `GET`       | `/metrics`           | Métricas de monitoramento da aplicação.      |