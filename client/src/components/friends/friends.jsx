import { useContext, useEffect, useState } from "react";
import {AuthContext} from "../../context/AuthContext";
import { AiOutlineUserAdd } from "react-icons/ai";
import FriendList from "../friendList/friendList";
import "./friends.css";
import axios from "axios";

export default function Friends() {

  const {user} = useContext(AuthContext);
  const [friendList, setFriendList] = useState([]);
  const [searchFriResult, setSearchFiResult] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [searchUserResult, setSearchUserResult] = useState([]);

  const [addFriend, setAddFriend] = useState(false);
  const [status, setStatus] = useState(true);
  const [listUserStatus, setListUserStatus] = useState(false)
  const [searchUser, setSearchUser] = useState("")

  // lấy ra bạn bè
  useEffect(() => {
    const getFriendInfo = async () => {

      try {
        const res = await axios.get("/users/" + user._id + "/friends")
        const temp = [...new Set(res.data)]
        setFriendList(temp)
      } catch (error) {
        console.log(error);
      }
    }
    getFriendInfo();
  },[user])

  // lấy ra tất cả người dùng
  useEffect(() => {
    const getAllUser = async () => {
       try {
           const res = await axios.get("/users/" + user._id + "/fr-suggestion")
           setAllUser(res.data)
       } catch (error) {
           console.log(error);
       }
    }
    getAllUser();

  },[user])

  // lọc những người có trong bạn bè trùng với từ tìm kiếm
  const searchInFriend = async (e) => {
    if(e.target.value.length !==0) {
      try {
        // const res = await axios.get("/users/" + user._id + "/friends")
        // const friends = res.data;
        const filteredFriend = friendList.filter(friend => 
           friend.name.includes(e.target.value)
        )
        console.log(filteredFriend);
        
        setSearchFiResult(filteredFriend);
  
      } catch (error) {
        console.log(error);
      }

      setStatus(false)
    } else {
      setStatus(true);
    }
  };

  

  const searchInUser = async (e) => {
    if(e.target.value.length !== 0) {
      setSearchUser(e.target.value)
      if(allUser.length > 0 && friendList.length > 0) {
        const result = allUser.filter(userSug => {
          const findInFriend = friendList.findIndex(fri =>
                fri.id === userSug._id
            )
          return findInFriend < 0
        })
        const userResult = result.filter(user_ =>
          user_.username.includes(e.target.value)
        )
          console.log(userResult);
          setSearchUserResult(userResult)
          setListUserStatus(true)
      } else if( friendList.length === 0) {
        const userResult2 = allUser.filter(user_ =>
          user_.username.includes(e.target.value)
        )
        console.log(userResult2);
        setSearchUserResult(userResult2)
        setListUserStatus(true)
      }
    } else {
      setSearchUser("")
      setListUserStatus(false)
    }
  }

  const setInput = (name) => {
    setSearchUser(name)
    setListUserStatus(false)
    console.log((name));
  }

  const handleSubmit = async (username) => {
    try {
      const res = await axios.get("/users/username/" + username)
      const userSubmit = res.data
        const invitation = {
            sender: user._id,
            receiver: userSubmit._id
        }
        try {
            const res = await axios.post("/invitations/add", invitation)
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
      console.log(error);
    }
    console.log(username,"submit");
    setAddFriend(!addFriend)
}
  
  return (
    <div className="friendList">
      <div className="friendsearch">
        <input  
              className="inputSearch" 
              placeholder="Search for your friends"
              onChange={searchInFriend}
              
        />
        {/* <div className="addFriendsWrapper"> */}
          <button
            className="addFriendsButton"
            onClick={() => setAddFriend(!addFriend)}
            >
            <AiOutlineUserAdd />
          </button> 
        </div>

        {addFriend && (
          <div className="modal">
            <div
              onClick={() => setAddFriend(!addFriend)}
              className="overlay"
            ></div>
            <div className="modal-content">
              <div className="userSearchField">
                <input
                  placeholder="Tìm kiếm người dùng"
                  className="userSearchForAdd"
                  onChange={searchInUser}
                  value={searchUser}
                />
              </div>
              <div className="listUsers">
                {listUserStatus && searchUserResult.length > 0 && searchUserResult.map(function(user_, key) {
                  return <h3 key={key}>
                    <div className="user">
                      <h4 className="name" onClick={(e) =>{setInput(user_.username)}}>{user_.username}</h4>
                    </div>
                  </h3>
                })}
              </div>
              <div className="active">

              <button className="cancel" onClick={() => setAddFriend(!addFriend)}>Cancel</button>
              <button className="submit" onClick={(e) => handleSubmit(searchUser)}>Submit</button>
              </div>
            </div>
          </div>
        )}

          {status?
            <div className="friends">
            {
              friendList.map(function(friend, key) {
                return <FriendList friendId={friend.id} key={key}/>
              })
            }
          </div> 
          : <>{searchFriResult.length === 0? <div className="noResult">No result</div> 
              : <div className="friends">
                  {
                    searchFriResult.map(function(friend, key) {
                      return <FriendList friendId={friend.id} key={key}/>
                    })
                  }
                </div>
              }</>}
      
    </div>
  );
}
