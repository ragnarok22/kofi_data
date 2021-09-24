const express = require('express')
const scrapping = require('./scrapping')

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/:username', async (req, res) => {
  try {

    const { username } = req.params;
    let result = await scrapping.getCrowdfunding(username);
    res.send(result);

  } catch (error) {

    console.log(error.name);
    console.log(error.message);

    res.status(500).send({
      type: 'error',
      code: error.name,
      message: error.message
    })

  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
