# Product CRUD API

Uma API RESTful simples e estruturada para gerenciamento de produtos, desenvolvida com Node.js, Express e MongoDB. Este projeto foi construído aplicando o padrão de arquitetura MVC (Model-View-Controller) para melhor organização e escalabilidade do código.

Projeto desenvolvido como parte dos estudos para o curso de Sistemas para Internet do Senac.

## 🚀 Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript.
* **Express.js**: Framework web para Node.js, utilizado para criar as rotas e gerenciar requisições HTTP.
* **MongoDB & Mongoose**: Banco de dados NoSQL e a biblioteca de modelagem de objetos para conectar e interagir com o banco.
* **Dotenv**: Gerenciamento de variáveis de ambiente para proteger dados sensíveis (como a string de conexão do banco).
* **Nodemon**: Utilitário para reiniciar automaticamente o servidor durante o desenvolvimento.

## 📁 Arquitetura do Projeto (MVC)

O código está estruturado em responsabilidades claras:
* `models/`: Define a estrutura (schema) dos produtos no banco de dados.
* `controllers/`: Contém a lógica de negócio (o que acontece quando uma rota é chamada).
* `routes/`: Mapeia as URLs da API para as funções do controller.
* `index.js`: Ponto de entrada da aplicação, responsável por configurar o servidor e conectar ao banco.

## 🗺️ Roadmap e Melhorias Futuras (V2)

Este projeto foi inicialmente concebido com um escopo fechado e uma modelagem de dados simplificada para atender aos requisitos acadêmicos da disciplina. No entanto, visando a evolução contínua e a demonstração de conceitos avançados de engenharia de software, o seguinte roadmap está planejado:

- [ ] **Gestão de Pedidos (Relacionamento de Entidades):** Criação da entidade `Order` para agrupar múltiplos produtos, introduzindo transações no banco de dados.
- [ ] **Histórico e Controle de Estoque:** Registro de movimentações de entrada e saída, onde o saldo é calculado dinamicamente em vez de apenas sobrescrito.
- [ ] **Autenticação e Autorização (RBAC):** Implementação de segurança com JWT (JSON Web Tokens) para separar permissões de administradores e usuários comuns.
- [ ] **Cobertura de Testes (QA):** Implementação de testes automatizados e de integração com Jest e Supertest para garantir a estabilidade das rotas e regras de negócio.

## 🛠️ Como executar o projeto localmente

### Pré-requisitos
* Ter o [Node.js](https://nodejs.org/) instalado.
* Ter uma conta e um cluster no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ou rodar o MongoDB localmente).

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
