const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json())

const customers = [];

app.get('/account', (request, response) => {
  return response.json(customers)
})

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.params;

  const customer = customers.some(customer => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer Not Found" });
  }

  request.customer = customer;

  return next()
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  customers.push({
    id: uuidv4(),
    cpf,
    name,
    'statement': []
  })

  return response.status(200).json({ message: "account created" })
})

app.get("/statement/:cpf", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request.customer

  return response.json(customer.statement)
})

app.listen(3000)