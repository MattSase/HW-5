const express = require('express')

const app = express()

const path = require('path')

// const db = require('./queries')

const PORT = 8000


// Middleware

//host react app as static files 
app.use(express.static(path.resolve(__dirname, '../frontend/build')))

//routes

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'))
})



//CRUD
// CREATE - add data to db
// READ - get data from db
// app.get('/links', db.getLinks)
// UPDATE - update data in db
// DELETE - remove data from db

// Starting Express on our PORT
app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}.`) 
})