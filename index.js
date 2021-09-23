const express = require('express')
const scrapping = require('./scrapping')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/:username', (req, res) => {
  const username = req.params.username
  scrapping.getCrowdfunding(username).then((results) => {
    console.log(results);
    res.send(results);
  }).catch(error => {
    console.log(error.name);
    console.log(error.message);
    res.send({
      type: 'error',
      code: error.name,
      message: error.message
    })
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
