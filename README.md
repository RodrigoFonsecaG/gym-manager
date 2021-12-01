# Gym manager


## 📝 Sobre

**Gym manager** é um controlador de uma academia


---------

## 🖥️ Demonstração

<h1>
    <img src="teachers-index.png"
</h1> 

<h1>
    <img src="teachers-details.png"
</h1> 

<h1>
    <img src="students-index.png"
</h1> 

<h1>
    <img src="students-details.png"
</h1> 



----------


## 🚀 Tecnologias e ferramentas utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **NodeJS**
- **PostgreeSQL**
- **Nunjucks**
- **Method override**
- **Express**

---------

## 📺 Criação do banco de dados
No PostgreSQL execute o arquivo `gymmanager.sql` em `database/gymmanager.sql` para criar o banco de dados, tabelas e popular.

Acesse o arquivo `db.js` em `src/config/db.js` e configure o usuário e senha de conexão com o PostgreSQL.

```js
module.exports = new Pool({
    // user: 'Usuário PostgreSQL',
    // password: 'Senha PostgreSQL',    
    host: 'localhost',
    port: 5432,
    database: 'gymmanager'
});

---------

## 💻 Instalação e uso

```bash
# Abra um terminal e copie este repositório com o comando
$ git clone https://github.com/RodrigoFonsecaG/gym-manager.git
# ou use a opção de download.

# Entre na pasta do projeto 
$ cd academia

# Instale as dependências
$ npm install

# Rode o aplicação
$ npm start

#Por fim acesse o localhost:3000 no seu navegador.
```

-----------
