import { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
import { FaRegTimesCircle} from "react-icons/fa";



export default function FriendList({friendId}) {

    const [user, setUser] = useState(null);
    const [model, setModel] = useState(false);

    useEffect(() => {
        const getFriendInfo = async () => {
        try {
            const res = await axios.get("/users/" + friendId)
            setUser(res.data);
            
        } catch (error) {
            console.log(error);
        }
        };
        getFriendInfo();
    })

    const handletoggle = () => {
        setModel(!model);
    }

    return (
        <>

        <div className="friend" onClick={handletoggle}>
                <img
                className="friendAvatar"
                src={user?.avatarURL}
                alt=""
                />
                <h1 className="friendName">{user?.name} </h1>
        </div>

        {model && (
        <div className="modal">
          <div onClick={handletoggle} className="overlay"></div>
          <div className="modal-content">
            <div className="profilePictureWrapper">
              <img
                src={user.avatarURL}
                alt=""
                className="profilePicturePop"
              />
            </div>
            <h3>User Name: {user.username}</h3>
            <h3>Name: {user.name}</h3>
            <h3>Friends: {user.friends.length}</h3>
            <button className="close-modal" onClick={handletoggle}>
              <FaRegTimesCircle className="exit" />
            </button>
          </div>
        </div>
      )}
        
        </>
    );
}