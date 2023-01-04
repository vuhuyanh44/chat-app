import "./home.css"
import LeftBar from "../../components/leftbar/leftBar";

import Messenger from "../../components/messenger/messenger";


export default function Home() {
    return (
        <div className="tab">
            <LeftBar />          
            <Messenger />
        </div>
    );
}