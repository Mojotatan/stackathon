const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();
const server = app.listen(3000, () => {console.log('Listening on port 3000...')})

const socketio = require('socket.io')
const io = socketio(server)

let players = {
  red: null,
  blue: null,
  ready: {
    red: false,
    blue: false
  }
}

io.on('connection', socket => {
  console.log('A user has connected @', socket.id)

  if (!players.red) {
    players.red = socket.id
    console.log(socket.id, 'assigned to red')
    socket.emit('player assignment', 'red')
  } else if (!players.blue) {
    players.blue = socket.id
    console.log(socket.id, 'assigned to blue')
    socket.emit('player assignment', 'blue')
  }
  // if (players.red && players.blue) {
  //   socket.emit('start')
  //   socket.broadcast.emit('start')
  // }

  socket.on('ready', (iAm) => {
    if (iAm) {
      players.ready[iAm] = true
      console.log(iAm, 'player ready')
      if (players.ready.red && players.ready.blue) {
        socket.emit('start')
        socket.broadcast.emit('start')
      }
    }
  })

  socket.on('disconnect', () => {
    if (players.red === socket.id) players.red = null
    else if (players.blue === socket.id) players.blue = null
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
