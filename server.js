import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello there')
})
app.listen(3030, () => {
  console.log('Server ready at port 3030')
})

app.get('/api/bug', (req, res) => {
  console.log('works')
})

app.get('/api/bug/save', (req, res) => {
  console.log('works')
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  console.log(bugId)
  res.send(bugId)
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  console.log('works')
})
