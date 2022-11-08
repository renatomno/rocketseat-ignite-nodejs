const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json())

const customers = [];

app.get('/account', (request, response) => {
  return response.json(customers)
})

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf)

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "customer already exists" })
  }

  customers.push({
    id: uuidv4(),
    cpf,
    name,
    'statement': []
  })

  return response.status(200).json({ message: "account created" })
})

app.get("/statement/:cpf", (request, response) => {
  const { cpf } = request.params;

  const customerExists = customers.find(customer => customer.cpf === cpf)

  return response.json(customerExists.statement)
})

app.listen(3000)