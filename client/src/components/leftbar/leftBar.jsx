import "./leftBar.css";
import { BsFillChatFill } from "react-icons/bs";
import { FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import Profile from "../../pages/profile/profile";

export default function LeftBar() {
  return (
    <div className="tab__1">
      <Profile />
      <div className="tab__1__list">
        <button className="tab__1__list-items" title="Tin nhắn" onClick={() => {window.location.href = "http://localhost:3000"}}>
          <BsFillChatFill className="items" />
        </button>
        <button className="tab__1__list-items" title="Bạn bè" onClick={() => {window.location.href = "http://localhost:3000/friend"}}>
          <FaUserFriends className="items" />
        </button>
        <button className="tab__1__list-items tab__1__list-items-last " title="Thoát" onClick={() => {
           localStorage.clear()
           window.location.href = "http://localhost:3000/signIn"
          }}>
          <FaSignOutAlt className="items" />
        </button>
      </div>
    </div>
  );
}
