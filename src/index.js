const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const app = express()
const http = require('http');
const { textMessage } = require('./message.js')
// const { add_user, remove_user, get_user, get_usersInRoom } = require('./util/users.js');
const util = require('./util/users.js');
// raw http server
const server = http.createServer(app)

const io = socketio(server)
const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    console.log('server is on')
    // notify other user
    // socket.broadcast.emit('newuser', textMessage('New user Joined'))
    socket.on('join', ({ username, roomid }, callback) => {
        const { error, user } = util.add_user({ id: socket.id, username, room: roomid })
        console.log(username, '\t', roomid)
        if (error)
            return callback(error)
        // console.log(error)
        socket.join(roomid)
        socket.emit('joined', textMessage('welcome!'))
        const notify = `${username} joined ${roomid}`
        socket.broadcast.to(roomid).emit('joined', textMessage(notify))
        callback()
    })
    // sending message to other
    socket.on('message', (message, callback) => {
        const user = util.get_user(socket.id)
        console.log(socket.id)
        if (user)
            io.to(user.room).emit('message', user.username, textMessage(message))
        // console.log('message Received', textMessage(message))
        // console.log(user.username, user.room)
        callback('Message Deliverd')
    })

    socket.on('location', (cords, callback) => {
        console.log('user location')
        const user = util.get_user(socket.id)
        console.log(user)
        if (user) {
            io.to(user.room).emit('location', cords)
            callback('Location shared')
        }
    })
    socket.on('disconnect', () => {
        const user = util.remove_user(socket.id)
        if (user)
            socket.broadcast.to(user.room).emit('message', user.username, textMessage(`${user.username} left!`))
    })
})


app.use(express.static(path.join(__dirname, '../public')));


server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
