import "./friendViewer.css"
import FriendNotifications from "../friendNotifications/friendNotifications";
import FriSuggestItem from "../friSuggestItem/friSuggestItem"
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Pusher from "pusher-js"

export default function FriendViewer() {

    const {user} = useContext(AuthContext);
    const [friSuggestion, setFriSuggestion] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [invitation, setInvitation] = useState([]);

    useEffect(() => {
        const getFriendList = async () => {
          try {
            const res = await axios.get("/users/" + user._id + "/friends")
            const temp = [...new Set(res.data)]
            setFriendList(temp)
          } catch (error) {
            console.log(error);
          }
        }
        getFriendList();
    },[user])

// 6287681a4125ed94d4dd8fce nam
// 628604fc83fe10c734755c85 hoan
//6287a90171b25f4dc7487bb0 quang
    useEffect(() => {
        const getFriendSuggestion = async () => {
           try {
               const res = await axios.get("/users/" + user._id + "/fr-suggestion")
               setAllUser(res.data)
           } catch (error) {
               console.log(error);
           }
        }
        getFriendSuggestion();

    },[user])
    
    useEffect(() => {
        if(allUser.length > 0 && friendList.length > 0) {
            const userSuggest = allUser.filter(userSug => {
               const findInFriend = friendList.findIndex(fri =>
                    fri.id === userSug._id
                )
               return findInFriend < 0
            })
            setFriSuggestion(userSuggest)
        } else if(allUser.length > 0 && friendList.length === 0) {
            setFriSuggestion(allUser)
        }
    },[allUser, friendList])

    useEffect(() => {
        const getInvitation = async () => {
            try {
                const res = await axios.get("/invitations/" + user._id)
                const temp = [...new Set(res.data)]
                setInvitation(temp)
            } catch (error) {
                console.log(error);
            }
        }
        getInvitation();
    },[user])

    useEffect(() => {
    
        const pusher = new Pusher("64873375849c544489d1", {
          cluster: "ap1",
        });
    
        const channel = pusher.subscribe("invitation");
        channel.bind("insert", function (data) {
          const newInvitation = data.invitation;
          if (newInvitation.receiver == user?._id) {
            setInvitation([...invitation, data.invitation]);
          }
        });
    
        return () => {
          channel.unbind("insert");
          channel.unsubscribe();
        }
      },[invitation]);


    return (
        <div className="friendViewer">
            <div className="friendsRequest">
                <h1 className="header1">Friends request</h1>
        
                {invitation.length > 0? <>{
                            invitation.map(function(invitation, key) {
                                return <FriendNotifications invitation={invitation} key={key}/>
                            })
                        }</>
                    : <h2 className="noFriendsRequest">There is no friend request.</h2>}
            </div>

            <h3 className="header2">Friend suggestions</h3>
            <div className="friendSuggestions">
                {friSuggestion.length > 0? <>{
                    friSuggestion.map(function(userSuggest, key) {
                        return <FriSuggestItem userSuggest={userSuggest} key={key} />
                    })
                }</> : null}
            </div>
        </div>
    );
}