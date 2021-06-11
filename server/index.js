const express=require('express');
const socketio=require('socket.io');
const http=require('http');
const cors=require('cors')

const {addUser, removeUser, getUser, getUsersInRoom }=require('./user');

const router=require('./router');
const app=express();

const server=http.createServer(app);
const io=socketio(server);

app.use(router);
app.use(cors);

io.on('connection', (socket)=>{
    //console.log('We have new connection');


    socket.on('join',({name,room},callback)=>{
        console.log(name,room);
        const {error, user }= addUser({id:socket.id, name, room});

        if(error)
        {
            return callback(error);
        }

        socket.emit('message', {user:'admin',  text:`${user.name}, Welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user:'admin' , text:`${user.name}, has Joined`});
        socket.join(user.room);

        io.to(user.room).emit('roomData' , {room : user.room, users : getUsersInRoom(user.room)});
        callback();
    });



    socket.on('sendMessage', (message,callback)=>{

        const user = getUser(socket.id);
 
        io.to(user.room).emit('message', {user : user.name, text : message});
        io.to(user.room).emit('roomData' , {room : user.room, users : getUsersInRoom(user.room)})
        console.log('message sent!');
        callback();

    } );

 
    socket.on('disconnect', ()=>{
        console.log('User had left');
        const user=removeUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('message', {user :  'admin' , text : `${user.name} has Left the Chat`});
        }
    })
})




server.listen(process.env.PORT || 5000, ()=>{
    console.log(`Listening on Port 5000 start`);
})
