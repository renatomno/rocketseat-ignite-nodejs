const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json())

const customers = [];

app.get('/account', (request, response) => {
  return response.json(customers)
})

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer Not Found" });
  }

  request.customer = customer;

  return next()
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.Type === 'credit') {
      acc += operation.amount
    } else {
      acc -= operation.amount
    }
  }, 0);

  return balance;
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ message: "Customer Already Exists" });
  }
  customers.push({
    id: uuidv4(),
    cpf,
    name,
    'statement': []
  })

  return response.status(200).json({ message: "account created" })
})

app.get("/statement/:cpf", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request

  return response.json(customer.statement)
})

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body
  const { customer } = request

  customer.statement.push({
    id: uuidv4(),
    amount,
    created_at: new Date(),
    Type: 'credit'
  })

  return response.json({ message: "Statement Created" })
})

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement)

  if (balance < amount) {
    return response.status(400).json({ error: "Insuficient funds!" })
  }

  const statementOperation = {
    id: uuidv4(),
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation)

  return response.status(201).send();
})

app.listen(3000)