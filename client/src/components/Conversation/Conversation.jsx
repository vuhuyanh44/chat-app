
import "./Conversation.css";
import { useEffect,useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { FiXCircle } from "react-icons/fi";
import Pusher from 'pusher-js';
import axios from 'axios';
export default function Conversation({conversation,currentChat}) {
  const [lastMessage,setLastMessage]= useState("");
  const [conversationName,setConversationName]= useState("");
  const [avatarURL,setAvatarURL]= useState("");
  const {user}= useContext(AuthContext);

  const deleteConversation = async (e)=>{
    console.log("conversation"+ currentChat)
    e.preventDefault();
    try {
      const res= axios.delete("/conversations/delete/"+conversation._id);
    }
    catch (e) {
      console.log(e);
    }

  }

  useEffect(()=>{
    const getLastMessage= async ()=>{
      try {
        const res = await axios.get("/messages/" + conversation._id+"/lastmsg");
        const data= res.data[0];
        setLastMessage(data==null ? " " : data.text);
        
      }
      catch (e) {
        console.log(e);
      }
    }
    getLastMessage();
  },[]);

  useEffect( ()=>{
    const guestUserName = conversation.members.find(member=>member !==user.username);
   
    const getConversationNameAndAvatar= async ()=>{
      try{
          const res= await axios.get("/users/username/"+guestUserName);
          setAvatarURL(res.data.avatarURL);
          setConversationName(res.data.name);
      }
      catch(e){
        console.log(e);
      }
    }
    getConversationNameAndAvatar();
  },[])

  useEffect(()=>{
    const pusher = new Pusher('64873375849c544489d1', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('message');
    channel.bind('insert', function(data) {
      
      const newMessage = data.message;
      if(newMessage.conversationId ===conversation._id)
      {
        setLastMessage(newMessage==null ? " " : newMessage.text);
      }
      
    });

    return ()=>{
      channel.unbind('insert');
      channel.unsubscribe();
    }
  },[lastMessage]);

  return (
    

    <div className="conversation">
        <div className="conversationInfo">
        <img 
          className="conversationImg"
          src={avatarURL}
          alt=""
        />
        <div className="Info">
          <h5 className="room">{conversationName}</h5>
          
          <p className="messageText" >{lastMessage}</p>
        </div>
        </div>
        {/* <div className="delete-conversation">
          <button onClick={deleteConversation}>
            <FiXCircle/>
            
          </button>
        </div> */}
    </div>
   
  );
}
