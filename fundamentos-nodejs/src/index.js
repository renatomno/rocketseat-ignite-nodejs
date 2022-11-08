const express = require('express');

const app = express();

app.use(express.json())

const courses = [
  { "curso": "nodejs" },
  { "curso": "reactjs" },
  { "curso": "elixir" }
]

app.get('/courses', (request, response) => {
  return response.json(courses);
})

// app.post('/courses', (request, response) => {})
// app.patch('/courses', (request, response) => {})
// app.put('/courses', (request, response) => {})
// app.delete('/courses', (request, response) => {})

app.listen(3333, () => console.log('Servidor ouvindo a porta 3333'));