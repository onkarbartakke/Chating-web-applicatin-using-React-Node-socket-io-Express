import React from 'react'
import ReactEmoji from 'react-emoji';


import './Message.css';

const Message=({message :{user,text},name})=>{
    let isSendByCurrentUser=false;
    const trimeName=name.trim().toLowerCase();

    if(user===trimeName)
    {
        isSendByCurrentUser=true;
    }

    return (
        isSendByCurrentUser
        ?
        (
            <div className="messageContainer justifyEnd">
                <p className="sendText pr-10">{trimeName}</p>
                <div className="messageBox backgroundBlue">
                    <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
                </div>
            </div>
        )

        :

        (
            <div className="messageContainer justifyStart">
               
                <div className="messageBox backgroundLight">
                    <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                <p className="sendText pl-10">{user}</p>
            </div>
        )
    )
}

export default Message;