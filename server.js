import express from 'express'

import { bugsService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const port = 3030

app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.send('Hello there')
// })
// app.listen(port, () => {
//   console.log('Server ready at port 3030')
// })

app.get('/api/bug', (req, res) => {
  bugsService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error(`Couldn't get bugs`)
      res.status(500).send(`Couldn't get bugs`)
    })
})

app.get('/api/bug/save', (req, res) => {
  const { _id, title, severity } = req.query
  const bugToSave = { _id, title, severity: +severity }

  bugsService.save(bugToSave).then((savedBug) => res.send(savedBug))
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

  bugsService.getById(bugId).then((bug) => res.send(bug))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  const { id } = req.params

  bugsService.remove(id).then(() => res.send(`Bug ${id} was deleted...`))
})

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:3030/`)
)
