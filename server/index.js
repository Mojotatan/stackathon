const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();
const server = app.listen(3000, () => {console.log('Listening on port 3000...')})

const socketio = require('socket.io')
const io = socketio(server)

io.on('connection', socket => {
  console.log('A user has connected @', socket.id)

  socket.on('disconnect', () => {
    console.log('A user has disconnected @', socket.id)
  })
})

app.use(morgan('tiny'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'public', 'index.html'))
})
