import React, { useState , useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';


import InfoBar from '../InfoBar/InfoBar.js';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import './Chat.css';
let socket;

const Chat=({location})=>{

    const [name, setName]=useState('');
    const [room, setRoom]=useState('');

    const [users, setUsers] = useState('');
   
    const [message, setMessage]=useState('');
    const [messages, setMessages]=useState([]);
   
    //const ENDPOINT='http://localhost:5000';
    const ENDPOINT='https://chat-app-react-express-node.herokuapp.com/';
    //var socket = io('https://localhost:5000', { transport : ['websocket'] });
  

    
    useEffect(()=>{
        const {name, room }=queryString.parse(location.search);

        //console.log(name);
        //console.log(room);
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        };
        socket=io(ENDPOINT, connectionOptions);
        setName(name);
        setRoom(room);

        socket.emit('join',{name, room}, (error)=>{
                if(error)
                {
                    alert(error)
                }
        });
        
        //console.log(socket);
        //console.log(location.search);
       // console.log(data);
        /*
       return ()=>{
           socket.emit('disconnect');
           socket.off();
       }
       */
    },[ENDPOINT,location.search]);

    useEffect(() => {

        socket.on('message',(message)=>{
            setMessages(messages=> [...messages, message ]);
            console.log('calling set Messages done');
        });
        
        

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });


    },[]);

    const sendMessage=(event)=>{
        event.preventDefault();
        
        if(message)
        {   //setMessages(messages=> [...messages, message ]);
            socket.emit('sendMessage',message, ()=>setMessage(''));
        }
    }

    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
               
            </div>
            <TextContainer users={users}/>
        </div>
    );
}

export default Chat;