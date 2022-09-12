const express = require('express')
const app = module.exports = express()
const fs = require('fs')
const morgan = require('morgan')
const routes = fs.readdirSync('./routes')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())

routes.forEach(routerName => {
  try {
    const childRouter = require(`./routes/${routerName}`)
    app.use(`/api/v1${childRouter.path}`, childRouter.routes)
  }
  catch (error) {
    if (error instanceof TypeError) {
      console.warn(`Error: Couldn't load routes for: ${routerName.replace(/\.[^/.]+$/, '')}`)
      console.log(`Message: ${error.message}`)
    }
    else {
      console.error(error)
    }
  }
})

if (module === require.main) {
  console.log('Starting Scratch Business Days API in %s mode', process.env.NODE_ENV)

  const server = app.listen(3000, 'localhost', () => {
    const host = server.address().address
    const port = server.address().port
    console.log('Scratch Business Days API listening on http://%s:%d', host, port)
  })
}
