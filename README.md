# Product CRUD API

Uma API RESTful estruturada para gerenciamento de produtos com autenticação JWT e relacionamento entre entidades, desenvolvida com Node.js, Express e MongoDB. O projeto aplica o padrão de arquitetura MVC (Model-View-Controller) e evoluiu de um CRUD simples para uma API com segurança, múltiplas entidades e regras de negócio reais.

Projeto desenvolvido como parte dos estudos para o curso de Sistemas para Internet do Senac.

🔗 **API em produção:** https://crud-api-products.onrender.com

---

## Tecnologias Utilizadas

* **Node.js** — Ambiente de execução JavaScript no servidor.
* **Express.js** — Framework web para criação das rotas e gerenciamento de requisições HTTP.
* **MongoDB & Mongoose** — Banco de dados NoSQL e biblioteca de modelagem de objetos (ODM). Hosted no MongoDB Atlas (AWS / São Paulo).
* **JSON Web Token (jsonwebtoken)** — Geração e verificação de tokens JWT para autenticação stateless.
* **bcryptjs** — Hash seguro de senhas antes de salvar no banco. Nunca armazenamos senha em texto puro.
* **CORS** — Permite que o front-end Angular (em domínio diferente) acesse a API sem bloqueio do navegador.
* **Dotenv** — Gerenciamento de variáveis de ambiente para proteger credenciais sensíveis.
* **Nodemon** — Reinício automático do servidor durante o desenvolvimento.

---

## 📁 Arquitetura do Projeto (MVC)

```
crud-api-products/
├── controllers/
│   ├── auth.controller.js       # Registro, login e validação de token
│   ├── category.controller.js   # CRUD de categorias com regra de negócio
│   └── product.controller.js    # CRUD de produtos com populate
├── middleware/
│   └── auth.middleware.js       # Verificação do JWT — protege rotas de escrita
├── models/
│   ├── category.model.js        # Schema de categorias (name único)
│   ├── product.model.js         # Schema de produtos (ref → Category)
│   └── user.model.js            # Schema de usuários (hash bcrypt no pre save)
├── routes/
│   ├── auth.routes.js           # POST /register, POST /login, GET /me
│   ├── category.routes.js       # GET públicos, POST/DELETE protegidos
│   └── product.routes.js        # GET públicos, POST/PUT/DELETE protegidos
├── .env                         # Variáveis de ambiente (não vai ao GitHub)
├── .gitignore
├── index.js                     # Ponto de entrada, CORS, rotas, error handler
└── package.json
```

---

## 🗺️ Entidades e Relacionamentos

```
User          Category          Product
────────      ────────          ────────
_id           _id               _id
name          name (unique)     name
email         description       price
password*     createdAt         quantity
createdAt     updatedAt         image
updatedAt                       category → ref: Category
                                createdAt
                                updatedAt
```
`*` Senha armazenada como hash bcrypt — nunca em texto puro.

O campo `category` em Product é um `ObjectId` que referencia um documento da coleção `Category`. Nas rotas GET, o Mongoose substitui o ID pelo objeto completo via `.populate('category', 'name description')`.

---

## 🔐 Autenticação e Autorização

A API utiliza autenticação **stateless** com JWT. O token é gerado no login/registro e deve ser enviado em todas as requisições protegidas.

**Header obrigatório nas rotas protegidas:**
```
Authorization: Bearer <token>
```

**Rotas públicas** (sem token):
```
GET  /api/products
GET  /api/products/:id
GET  /api/categories
GET  /api/categories/:id
```

**Rotas protegidas** (token JWT obrigatório):
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

POST   /api/categories
DELETE /api/categories/:id
```

---

## 📋 Endpoints da API

### Auth

| Método | Rota                  | Body                              | Descrição                |
|--------|-----------------------|-----------------------------------|--------------------------|
| POST   | `/api/auth/register`  | `name`, `email`, `password`       | Cria conta e retorna JWT |
| POST   | `/api/auth/login`     | `email`, `password`               | Autentica e retorna JWT  |
| GET    | `/api/auth/me`        | —                                 | Retorna usuário do token |

### Produtos

| Método | Rota                  | Auth | Descrição                        |
|--------|-----------------------|------|----------------------------------|
| GET    | `/api/products`       | ❌   | Lista todos (category populada)  |
| GET    | `/api/products/:id`   | ❌   | Busca por ID                     |
| POST   | `/api/products`       | ✅   | Cria produto                     |
| PUT    | `/api/products/:id`   | ✅   | Atualiza produto (parcial)       |
| DELETE | `/api/products/:id`   | ✅   | Remove produto                   |

### Categorias

| Método | Rota                    | Auth | Descrição                                        |
|--------|-------------------------|------|--------------------------------------------------|
| GET    | `/api/categories`       | ❌   | Lista todas                                      |
| GET    | `/api/categories/:id`   | ❌   | Busca por ID                                     |
| POST   | `/api/categories`       | ✅   | Cria categoria                                   |
| DELETE | `/api/categories/:id`   | ✅   | Remove (bloqueado se houver produtos vinculados) |

---

## ⚙️ Regras de Negócio

- **Senha nunca salva em texto puro** — o hook `pre('save')` do Mongoose aplica bcrypt automaticamente antes de qualquer inserção.
- **Mensagem de erro genérica no login** — retorna "Credenciais inválidas" tanto para e-mail inexistente quanto para senha errada, evitando que um atacante descubra quais e-mails estão cadastrados.
- **Categoria com produtos não pode ser excluída** — ao tentar deletar uma categoria com produtos vinculados, a API retorna `409 Conflict` informando quantos produtos estão bloqueando a exclusão.
- **Validação de ObjectId** — todas as rotas com `:id` validam o formato antes de consultar o banco, retornando `400` se inválido.
- **Atualização parcial** — o PUT só atualiza os campos enviados no body, mantendo os demais intactos.

---

## 🛠️ Como executar localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado
* Conta e cluster no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Passo a passo

**1. Clone o repositório:**
```bash
git clone https://github.com/TiagoAntunes-Dev/crud-api-products.git
cd crud-api-products
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz com:
```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>
PORT=4000
JWT_SECRET=seu_segredo_longo_aqui
```

**4. Inicie o servidor em desenvolvimento:**
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:4000`.

---

## ☁️ Deploy

| Serviço        | Plataforma    | Detalhes                               |
|----------------|---------------|----------------------------------------|
| API (Node.js)  | Render        | Free tier — deploy automático via push |
| Banco de dados | MongoDB Atlas | M0 Free Tier — AWS / São Paulo         |

O deploy é contínuo: qualquer `git push` na branch principal dispara um novo deploy no Render automaticamente.

---

## 🗺️ Próximos Passos

- [ ] **Testes automatizados** — cobertura de rotas com Jest e Supertest
- [ ] **Paginação** — `GET /api/products?page=1&limit=10`
- [ ] **Filtros** — busca por categoria, faixa de preço e nome
- [ ] **RBAC** — perfis admin vs. usuário comum com permissões diferentes
- [ ] **Gestão de Pedidos** — entidade `Order` agrupando múltiplos produtos com cálculo de total