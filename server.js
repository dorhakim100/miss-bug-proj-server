import express from 'express'
import cookieParser from 'cookie-parser'

import PDFDocument from 'pdfkit'

import fs from 'fs'

import { bugsService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const port = 3030

app.use(express.static('public'))
app.use(cookieParser())

// app.get('/', (req, res) => {
//   res.send('Hello there')
// })
// app.listen(port, () => {
//   console.log('Server ready at port 3030')
// })

app.get('/api/bug/download', (req, res) => {
  bugsService.query().then((bugs) => {
    const doc = new PDFDocument()
    const pdfsDir = './pdfs'
    const fileName = 'Bugs.pdf'

    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir)
    }
    doc.pipe(fs.createWriteStream(`${pdfsDir}/${fileName}`))
    let counter = bugs.length
    bugs.map((bug) => {
      let imageSrc
      if (bug.severity <= 3) {
        imageSrc = `public/img/1.png`
      } else if (bug.severity > 3 && bug.severity <= 7) {
        imageSrc = `public/img/2.png`
      } else if (bug.severity > 7) {
        imageSrc = `public/img/3.png`
      }

      doc.image(imageSrc, {
        fit: [100, 100],
        align: 'center',
        valign: 'center',
      })
      doc
        .font('fonts/calibri-regular.ttf')
        .fontSize(20)
        .text(`${bug.title} - Severity: ${bug.severity}`, 200, 100)
        .text(bug.description, 100, 400)
      counter--
      if (counter !== 0) {
        doc.addPage()
      }
    })

    doc.end()
  })
})
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
  const { _id, title, severity, description } = req.query
  const bugToSave = { _id, title, severity: +severity, description }
  console.log(bugToSave)

  bugsService.save(bugToSave).then((savedBug) => res.send(savedBug))
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

  var visitedBugs = req.cookies.visitedBugs || []
  console.log(visitedBugs)
  if (visitedBugs.length >= 3) {
    res.status(401).send('Bug Limit...')
  }
  if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

  bugsService.getById(bugId).then((bug) => res.send(bug))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
  console.log('works')
  const { bugId } = req.params
  console.log(bugId)

  bugsService.remove(bugId).then(() => res.send(`Bug ${bugId} was deleted...`))
})

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:3030/`)
)
