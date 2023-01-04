import Friends from "../../components/friends/friends";
import FriendViewer from "../../components/friendViewer/friendViewer";
import LeftBar from "../../components/leftbar/leftBar";
import "./friend.css";

export default function Friend() {
  return (
    <div className="friendPage">
        <LeftBar />
        <Friends />
        <FriendViewer />
      </div>
  );
}
