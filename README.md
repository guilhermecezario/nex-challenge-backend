# Challenge Nex

Link de produção: [nex-challenge](https://nex-challenge.herokuapp.com).

Utilizando [NestJs](https://nestjs.com/)

## Configurando

1. Renomeie o arquivo [.env.example](.env.example) para `.env` e adicione as variaveis ambiente

## Inicializando

```sh
# 1. Rode as migrations e as seeds do projeto com
npx prisma migrate dev && npx prisma db seed
```

## Rodando em desenvolvimento

```sh
npm run start:dev

```
abra [http://localhost:3000](http://localhost:3000)

## Rodando em produção

```sh
npm run lint
npm run build

npm start
```

## Usuario admin

```json
{
  "password": "nextar",
  "email": "mecontratanex@nextar.com.br",
}
```

## Documentação


```http
GET /users
```

```http
 Headers Authenticate Bearer {token}
```

Não á parâmetros

### resposta

```json
[
	{
		"id": number,
		"name": string,
		"password": string,
		"email": string,
		"permission": string,
		"phone": string
	},
]
```

```http
GET /users/:id
```

```http
 Headers Authenticate Bearer {token}
```

Não á parâmetros

### resposta

```json
{
  "id": number,
  "name": string,
  "password": string,
  "email": string,
  "permission": string,
  "phone": string
},
```

```http
POST /users
```

```http
 Headers Authenticate Bearer {token}
```

| Parâmetros | Tipo | Descrição |
| :--- | :--- | :--- |
| `name` | `string` | **Obrigatório** |
| `password` | `string` | **Obrigatório** mínimo 4 caracteres |
| `email` | `string` | **Obrigatório**. Campo unico |
| `permission` | `string` | admin ou standerd, padrão standerd |
| `phone` | `string` | **Obrigatório**. Campo unico |

### resposta

```json
{
  "id": number,
  "name": string,
  "password": string,
  "email": string,
  "permission": string,
  "phone": string
},
```

```http
PUT /users/:id
```

```http
 Headers Authenticate Bearer {token}
```

| Parâmetros | Tipo | Descrição |
| :--- | :--- | :--- |
| `name` | `string` | **Obrigatório** |
| `password` | `string` | **Obrigatório** mínimo 4 caracteres |
| `email` | `string` | **Obrigatório**. Campo unico |
| `permission` | `string` | admin ou standerd, padrão standerd |
| `phone` | `string` | **Obrigatório**. Campo unico |

### resposta

```json
{
  "id": number,
  "name": string,
  "password": string,
  "email": string,
  "permission": string,
  "phone": string
},
```

```http
POST /sessions
```

| Parâmetros | Tipo | Descrição |
| :--- | :--- | :--- |
| `email` | `string` | **Obrigatório**. Campo unico |
| `password` | `string` | **Obrigatório** mínimo 4 caracteres |

### resposta

```json
{
  "access_token": string
},
```

## Respostas de erros

```json
{
  "statusCode": number,
  "message": string[],
  "error": string,
},
```

## O que foi usado nesse projeto

- [NestJs](https://nestjs.com/), Uma estrutura Node.js progressiva para criar aplicativos do lado do servidor eficientes, confiáveis ​​e escaláveis.
- [Prisma](https://www.prisma.io/), O Prisma desbloqueia um novo nível de experiência do desenvolvedor ao trabalhar com bancos de dados
- [JWT](https://jwt.io/) JWT permite decodificar, verificar e gerar JWT.
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) Uma biblioteca para ajudá-lo a hash senhas.
- [NestJs Authentication](https://docs.nestjs.com/security/authentication) Para efetuar authenticação e validação de token
