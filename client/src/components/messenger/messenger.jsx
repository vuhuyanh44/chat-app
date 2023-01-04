import "./messenger.css";
import { FaPaperPlane, FaRegTimesCircle } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import Message from "../message/message";
import Conversation from "../Conversation/Conversation";
import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Pusher from "pusher-js";
/* FaSmile */

export default function Messenger() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatName, setCurrentChatName] = useState('');
  const [currenChatAvatarURL,setCurrentChatAvatarURL] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [newConversationInputText,setNewConversationInputText] = useState("");
  const scrollRef = useRef();
  const [addConver, setAddConver] = useState(false);
  const [friendsDontHaveConversation,setFriendsDontHaveConversation] = useState([]);
  const [friendUserName,setFriendUserName] = useState('');

  const [formWarning,setFormWarning] = useState("");
  
  const handleFormFocus =()=>{
    setFormWarning("");
  }
  
  
  const cancelAddConversation = (e)=>{
    setFriendUserName("");
    setFormWarning("");
    setNewConversationInputText("");
    setAddConver(!addConver);
  }

  const addConversation= async (e)=>{ 

    console.log("click");
    e.preventDefault();
    const data={
      members:[user.username,friendUserName],
      text:newConversationInputText,
      sender:user._id
    }
    try { 
        if(friendsDontHaveConversation.filter(
          (friend)=>(friend.username.includes(friendUserName))).length==0){
          setFormWarning("User không hợp lệ");
          console.log(friendUserName);
          console.log(friendsDontHaveConversation);
        } else if(newConversationInputText.length==0){
          setFormWarning("Vui lòng điền tin nhắn")
          console.log("Khong co tin nhan");
        }
        else{ 
          const res= axios.post("/conversations",data);
          console.log(res.data);
          setNewConversationInputText("");
          setAddConver(!addConver)

        }
    }
    catch (err) {
      console.log(err)
    }


  }

  const searchFriendsForNewConversation= async (e)=>{
    try{
      setFriendUserName(e.target.value);
      const res = await axios.get("/conversations/" + user.username);
      const userConversations=res.data; 
      const friendsResponse = await axios.get("/users/" + user._id+"/friends");
      const friends=friendsResponse.data;
     
      
      

      const hasntConversationFriends= friends.filter(friend=>{
        const checkForHasntConversation=true;
        const userName = friend.username;
        if(!userName.includes(e.target.value) ||e.target.value == "")
        {
          return false;
        }
        else{
          if(userConversations.length>0){
            userConversations.forEach(conversation=>{
              conversation.members.forEach(member=>{
                if(member.includes(e.target.value)&& member!=user.username) {
                      checkForHasntConversation=false;
                      return checkForHasntConversation;
                }
              })
            })
          } else { 
            return true;
          }
        }
      

        return checkForHasntConversation;
      })
      console.log(hasntConversationFriends);
       setFriendsDontHaveConversation(hasntConversationFriends);
    }
    catch(err){
      console.log(err);
    }
 }
    

  const sendMessage = async (e) => {
    e.preventDefault();
    const message = {
      conversationId: currentChat?._id,
      sender: user._id,
      text: inputText,
    };
    try {
      if(inputText.length>0){
        const res = await axios.post("/messages/", message);
        console.log(res.data);
        setInputText("");
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });

      }
    } catch (e) {
      console.log(e);
    }
  };

  const search = async (e) => {
    console.log("change");
    console.log(e.target.value);

    try {
      console.log(user.username);
      const res = await axios.get("/conversations/" + user.username);
      const userConversations=res.data;
      const filteredConversations = userConversations.filter(conversation =>{
        const members = conversation.members;
        const filteredMembers = members.filter(
          (member) =>
            member.includes(e.target.value) && member !== user.username
        );
        return filteredMembers.length > 0;
      });
      console.log(filteredConversations);

      setConversations(filteredConversations);
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user.username);
        
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    
    const pusher = new Pusher("64873375849c544489d1", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("message");
    channel.bind("insert", function (data) {
      const newMessage = data.message;
      if (newMessage.conversationId == currentChat?._id) {
        setMessages([...messages, data.message]);
      }
    });

    return () => {
      channel.unbind("insert");
      channel.unsubscribe();
    }
  },[messages]);

  useEffect(()=>{
    const pusher = new Pusher('64873375849c544489d1', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('conversation');
    channel.bind('insert', function(data) {
      

      const newConversation =data.conversation;
      if(newConversation.members.includes(user.username)){
        setConversations([...conversations,data.conversation]);
        setCurrentChat(data.conversation);  
        
      }
      
    });

   

    return ()=>{
      channel.unbind('insert');
     
      channel.unsubscribe();
    }
  },[conversations]);

  //chuc nang xóa nhưng mà bỏ
  useEffect(()=>{
    const pusher = new Pusher('64873375849c544489d1', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('conversation');
    channel.bind('delete', function(data){
      
      console.log(currentChat)
      const deleteConversation =data.conversation;
      console.log(deleteConversation);
      const getConversations = async () => {
        try {
          
          if (deleteConversation.members.includes(user.username)) {
            console.log("true")
            console.log(currentChat)
            if(currentChat!=null){
              console.log("currentChat khac null")
              console.log(deleteConversation._id," ",currentChat._id)
              if(deleteConversation._id==currentChat._id ){
                setCurrentChat(null);
                
              }
            }
            
            const res = await axios.get("/conversations/" + user.username);

            setConversations(res.data);
            
          }
        } catch (err) {
          console.log(err);
        }
      };
      getConversations();

    })
    return ()=>{
      channel.unbind("delete");
      channel.unsubscribe();
    }
  },[conversations]);

  useEffect(()=>{
  
    
    const getConversationName= async ()=>{
     try{
        if(currentChat!=null){
          const guestUserName = currentChat.members.find(member=>member !==user.username);
          const res= await axios.get("/users/username/"+guestUserName);
          
          setCurrentChatAvatarURL(res.data.avatarURL);
          setCurrentChatName(res.data.name);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const getMessages = async () => {
      try {
        if (currentChat != null) {
          const res = await axios.get("/messages/" + currentChat._id);
          setMessages(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getConversationName();
    getMessages();
  }, [currentChat,user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="tab__2">
        <div className="tab__2__wrapper">
          <div className="addConversationBar">
            <h4>Chats</h4>
            <button
              className="addConversationButton"
              onClick={() => setAddConver(!addConver)}
            >
              <AiOutlinePlus className="addConversationIcon"/>
            </button>
          </div>
          <div className="searchFriendBar">
            <input
              placeholder="Search for your conversation"
              className="friendSearchField"
              onChange={search}
            />

            {addConver && (
              <div className="modal">
                <div
                  onClick={() => setAddConver(!addConver)}
                  className="overlay"
                ></div>
                <div className="modal-content">
                  <div className="addConverForm">
                    
                    <div className="addConverField">

                      <input value={friendUserName}
                        onFocus={handleFormFocus}
                        placeholder="Tìm kiếm bạn bè"
                        className="friendSearchForAdd"
                        onChange={searchFriendsForNewConversation}
                      />
                    </div>
                    <div className="listFriends">
                      {friendsDontHaveConversation.length>0 ? (
                        friendsDontHaveConversation.map((friend) =>(
                          <div onClick={(e)=>{setFriendUserName(friend.username)}} key={friend.id}>
                              <h4 style={{margin:5}}>{friend.name} @{friend.username}</h4>
                          </div>
                        )
                         
                        )
                      )
                      : (
                        <h4 style={{margin:5}}>{(friendUserName.length!=0)?"Không có kết quả":""}</h4>
                      )

                    
                      }
                    </div>
                    
                    <div className="addConverField">
                      <input value={newConversationInputText}
                        placeholder="Nhập tin nhắn"
                        className="textMessage"
                        onChange={(e)=>{setNewConversationInputText(e.target.value)}}
                        onFocus={handleFormFocus}
                      />
                    </div>
                    <h4 style={{margin:5,color:"red",height:20}}>{formWarning}</h4>
                    <div className="addConverFormButton">
                    <button
                    className="closeAddConver" 
                    onClick={cancelAddConversation}
                    >
                      Close
                    </button>
                    <button 
                      
                      className="saveAddConver" onClick={addConversation}
                    >
                      Create
                    </button>
                    
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
          </div>

          <div className="conversations-wrapper">
            <h5>Conversations</h5>
            <div className="conversations">
              {conversations.length>0?(
                conversations.map((c) => (
                  <div onClick={() => {setCurrentChat(c)}} key={c._id}>
                    <Conversation conversation={c} currentChat={currentChat} />
                  </div>
                ))
              ):(
                <>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <h3 style={{marginTop:50}}>Không có cuộc trò chuyện.</h3>
                </div>
                </>
              )}

            
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="tab__3">
        {currentChat!= null ? (
      <>
        <div className="chat_header">
          <div className="user">
            <div className="user_avatar">
              <img
                className="user_avatar"
                src={currenChatAvatarURL}
                alt=""
              />
            </div>
           
            <div className="user_name">
                <h5 className="user_name">{currentChatName}</h5>
            </div>
            
          </div>
        </div>
        
        <div className="chat_masseages">
            {messages.map((m, index) => (
              <div ref={scrollRef} key={m._id}>
                <Message message={m} own={m.sender == user._id} sender={m.sender} />
              </div>
            ))}
        </div>
        

        <div className="chat_input">
          <form action="" className="form">
            <div className="chat_input_wrapper">
              <div className="input-container">
                <input
                value={inputText}
                type="text"
                className="input"
                placeholder="Nhập tin nhắn..."
                onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <button
              className="sendButton"
              title="Gửi"
              type="submit"
              onClick={sendMessage}
              disabled={inputText.length==0}
              style={(inputText.length==0)?{opacity:0.6}:{opacity:1}}
              >
              <FaPaperPlane className="send_icon" />
            </button>
            </div>

            
          </form>
        </div>
      </>):(
          <div className="default-screen">
            <div>
            <h2>Welcome to The 48 Hours</h2>
            <h3>A brand new thing.</h3> 
            </div>
          </div>
        )}
      </div>
    </>
  );
}