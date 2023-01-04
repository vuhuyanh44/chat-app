import "./chatMenu.css";
import Conversation from "../Conversation/Conversation";
import { useEffect,useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
export default function ChatMenu() {
  const {user}= useContext(AuthContext);
  const [conversations,setConversations]= useState([]);
  const [currentChat,setCurrentChat]= useState(null);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  },[user._id]);

  
  
  return (
    <div className="tab__2">
      <div className="tab__2__wrapper">
          <input placeholder="Search for your conversation" className="friendChatMenu" />
          <div className="conversations">
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)} key={c._id}>
                <Conversation conversation={c} />
                {console.log(currentChat)}
              </div>
            ))}
            
          </div>
      </div>
    </div>
  );
}
