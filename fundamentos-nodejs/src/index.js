const express = require('express');

const app = express();

app.get('/', (request, response) => {
  return response.json({ message: 'it works!' });
})

app.listen(3333, () => console.log('Servidor ouvindo a porta 3333'));