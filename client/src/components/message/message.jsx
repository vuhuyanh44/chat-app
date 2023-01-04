import "./message.css"
import {format} from "timeago.js"
import { useEffect,useState} from "react";
import axios from "axios";
export default function Message({message,own,sender,user}) {

    const [avatarURL,setAvatarURL]= useState("");
    
    useEffect(() => {
        const getAvatarURL= async()=>{
            try{
                const res= await axios.get("/users/" + sender);
                setAvatarURL(res.data.avatarURL);
            } catch(err){
                console.log(err);
            }
        }
        getAvatarURL();
    },[]);

    return (
        <div className= {own ? "message" : "message recievingMessage"}>
            <div className= {own ? "messageTop" : "messageTop receivingMessage"}>
                <img src={avatarURL}
                alt="This is image message" 
                className="messageImg" />
                <p className="messageContent">{message.text}</p>
            </div>
            <div className= {own ? "messageBottomSending" : "messageBottomReceiving"}>{format(message.createdAt)}</div>
        </div>
    );
}