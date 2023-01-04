import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./friendNotifications.css";



export default function FriendNotifications({invitation}){
    const {user} = useContext(AuthContext);
    const [accept, setAccept] = useState(false);
    const [status, setStatus] = useState(true);
    const [userSend, setUserSend] = useState([]);
    

    useEffect(() => {
        const getInfoUser = async () => {
            try {
                const res = await axios.get("/users/" + invitation.sender)
                setUserSend(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getInfoUser();
    },[user])

    
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const handleAccept = async (Event) => { 
        try {
            const res = await axios.delete("/invitations/delete/accept/" + invitation._id)
        } catch (error) {
            console.log(error);
        }
        setAccept(true)
        await delay(1000)
        setStatus(false)
        console.log("accept");
    }

    const handleRefuse = async () => {
        const res = await axios.delete("/invitations/delete/refuse/" + invitation._id)
        setStatus(false)
        console.log("refuse");
    }

    // console.log(currentUser);
    

    return(
        <>
        {status &&
        <div className="notifications">
            <div className="userWrapper">
                <img 
                    className="avatarUser"
                    src={userSend.avatarURL} 
                    alt="" 
                />
                <h1 className="nameUser">{userSend?.name} đã gửi cho bạn lời mời kết bạn</h1>
            </div>

            {!accept? 
            <div className="decision" >
                <button className="accept" onClick={handleAccept}>Accept</button>
                <button className="refuse" onClick={handleRefuse}>Refuse</button>
            </div> 
            : <div className="accepted">
                <h2>Accepted the friend request!</h2>
            </div>}

        </div> }
        </>
    )
}