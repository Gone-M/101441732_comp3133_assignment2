const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }
  
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    position: String!
    department: String!
    salary: Float!
    profilePicture: String
  }
  
  input EmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    position: String!
    department: String!
    salary: Float!
    profilePicture: String
  }
  
  type Query {
    getAllEmployees: [Employee!]!
    getEmployee(id: ID!): Employee
    searchEmployees(criteria: String!, value: String!): [Employee!]!
  }
  
  type Mutation {
    login(username: String!, password: String!): User!
    signup(username: String!, email: String!, password: String!): User!
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;