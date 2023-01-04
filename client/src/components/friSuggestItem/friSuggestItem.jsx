import "./friSuggestItem.css";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function FriSuggestItem({userSuggest}) {

    const {user} = useContext(AuthContext);
    const [status, setStatus] = useState(true);
    const [addFriend, setAddFriend] = useState(false);


    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const handleAddFriend = async () => {
        const invitation = {
            sender: user._id,
            receiver: userSuggest._id
        }
        try {
            const res = await axios.post("/invitations/add", invitation)
        } catch (error) {
            console.log(error);
        }
        setAddFriend(true)
        await delay(1000)
        setStatus(false)
    }

    return(<>{ status &&
        <div className="friendItems">
                <img className="avatar" src ={userSuggest.avatarURL} alt = "img"></img>  
                <div className="name">{userSuggest?.name}</div>
                {!addFriend? <button className="addFriendButton" onClick={handleAddFriend}>Add Friend</button> 
                    : <h1>Request Success!</h1>}
        </div>
    }</>)
}