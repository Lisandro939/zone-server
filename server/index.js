import express from 'express'
import logger from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'

const PORT = process.env.PORT ?? 3001;

const app = express();
app.use(logger('dev'));

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }

});

app.get("/", (req, res) => {
    res.send("<h1>Esto es el chat</h1>")
});

io.on('connect', socket => {
    console.log('Client connected ', socket?.id)

    socket.on('message', (body) => {
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(6)
        })
    })
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})