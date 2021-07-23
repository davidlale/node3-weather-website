
const path = require('path')
const express = require('express')
const hbs = require('hbs')
//  const { query } = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

// Define the paths for express config (see expressjs.com)
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// St up handlebars engine and views location
app.set('view engine','hbs') //set up handlebars, integrated with express
app.set('views', viewsPath) //changing the path for the views directory, calling it templates (optional)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'David Lale'
  }) // needs to match file name in views folder
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'David Lale'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is the help function',
    title: 'How can I help you today?',
    name: 'David Lale'
  })

})

app.get('/help/*', (req, res) => {

  res.render('404', {
    title: '404',
    name: 'David Lale',
    errorReason: 'Help article not found'
})
})







app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address

      })
    })
  })
})

//   res.send({
//     location: 'Philadelphia',
//     forecast: 'Sunny',
//     address: req.query.address
      
//   })
// 

app.get('/products', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide a search term'
    })
  }
  console.log(req.query.search)
  res.send({
    products: []
  })
})



// has to be the final one for the error page
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'David Lale',
    errorReason: 'Page not found.'
 })

 })

app.listen(3000, () => {
  console.log('Server started on port 3000')
})