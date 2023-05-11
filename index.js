const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors')

// Data pengguna yang akan digunakan dalam contoh ini
const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', password: 'password123' },
  { id: '2', name: 'Bob', email: 'bob@example.com', password: 'password456' },
];

// Schema GraphQL untuk register dan login
const schema = buildSchema(`
  type Query {
    login(email: String!, password: String!): User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`);

// Resolver untuk register dan login
const root = {
  register: ({ name, email, password }) => {
    const user = users.find(user => user.email === email);
    if (user) {
      throw new Error('Email sudah terdaftar');
    }
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    return { ...newUser, isSuccess: true };
  },
  login: ({ email, password }) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      throw new Error('Email atau password salah');
    }
    return user;
  },
};

// Inisialisasi server GraphQL dengan Express
const app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// Jalankan server pada port 4000
app.listen(4000, () => console.log('Server GraphQL berjalan pada http://localhost:4000/graphql'));
