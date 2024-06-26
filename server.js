import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import PDFDocument from 'pdfkit'

import fs from 'fs'

import { bugsService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()
app.use(express.json())

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
    console.log(bugs)
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
  let severityDown
  if (req.query.severityDown === 'true') {
    severityDown = true
  } else {
    severityDown = false
  }
  const filterBy = {
    txt: req.query.txt || '',
    minSeverity: +req.query.minSeverity || 0,
    severityDown: severityDown,
    pageIdx: +req.query.pageIdx || 0,
    labels: req.query.labels || [],
  }
  console.log(filterBy)
  bugsService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      // console.log(err)
      loggerService.error(`Couldn't get bugs`)
      res.status(500).send(`Couldn't get bugs`)
    })
})

// app.get('/api/bug/save', (req, res) => {
//   const { _id, title, severity, description, createdAt } = req.query
//   let { labels } = req.query
//   labels = JSON.parse(labels)
//   const bugToSave = {
//     _id,
//     title,
//     severity: +severity,
//     description,
//     labels,
//     createdAt,
//   }
//   console.log(bugToSave)

//   bugsService.save(bugToSave).then((savedBug) => res.send(savedBug))
// })

app.post('/api/bug', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Cannot add bug')

  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    severity: req.body.severity,
    description: req.body.description,
    labels: req.body.labels,
    createdAt: req.body.createdAt,
  }

  bugsService
    .save(bugToSave, loggedInUser)
    .then((savedBug) => {
      res.send(savedBug)
    })
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug')
    })
})

// app.get('/api/bug/:bugId', (req, res) => {
//   const { bugId } = req.params

//   var visitedBugs = req.cookies.visitedBugs || []
//   console.log(visitedBugs)
//   if (visitedBugs.length >= 3) {
//     res.status(401).send('Bug Limit...')
//   }
//   if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

//   res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

//   bugsService.getById(bugId).then((bug) => res.send(bug))
// })

app.put('/api/bug/:id', (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  let { createdAt, labels, severity } = req.body

  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Cannot update bug')

  var visitedBugs = req.cookies.visitedBugs || []
  console.log(visitedBugs)
  if (visitedBugs.length >= 3) {
    res.status(401).send('Bug Limit...')
  }
  if (!visitedBugs.includes(id)) visitedBugs.push(id)

  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

  const bug = {
    _id: id,
    title,
    severity,
    description,
    labels,
    createdAt,
  }
  console.log('bug:', bug)
  bugsService
    .save(bug, loggedInUser)
    .then((savedBug) => {
      res.send(savedBug)
    })
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(400).send('Cannot save bug')
    })
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  bugsService
    .getById(bugId)
    .then((bug) => {
      res.send(bug)
    })
    .catch((err) => {
      loggerService.error('Cannot get bug', err)
      res.status(400).send('Cannot get bug')
    })
})

// app.get('/api/bug/:bugId/remove', (req, res) => {
//   console.log('works')
//   const { bugId } = req.params
//   console.log(bugId)

//   bugsService.remove(bugId).then(() => res.send(`Bug ${bugId} was deleted...`))
// })

app.delete('/api/bug/:bugId', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Cannot remove car')

  const { bugId } = req.params
  bugsService
    .remove(bugId, loggedInUser)
    .then(() => {
      loggerService.info(`Bug ${bugId} removed`)

      res.send('Removed!')
    })
    .catch((err) => {
      loggerService.error('Cannot remove bug', err)
      res.status(400).send('Cannot remove bug')
    })
})

app.get('/api/user', (req, res) => {
  userService
    .query()
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      console.log('Cannot load users', err)
      res.status(400).send('Cannot load users')
    })
})

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService
    .getById(userId)
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      console.log('Cannot load user', err)
      res.status(400).send('Cannot load user')
    })
})

app.post('/api/auth/login', (req, res) => {
  const credentials = req.body
  userService.checkLogin(credentials).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      res.status(401).send('Invalid Credentials')
    }
  })
})

app.post('/api/auth/signup', (req, res) => {
  const credentials = req.body
  console.log(credentials)
  userService.save(credentials).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      res.status(400).send('Cannot signup')
    }
  })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged-out!')
})

// app.get('/**', (req, res) => {
//   res.sendFile(path.resolve('public/index.html'))
// })

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:3030/`)
)
