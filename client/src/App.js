import SignIn from './pages/signIn/signIn';
import SignUp from './pages/signUp/signUp';
import Home from './pages/home/home';
import Friend from './pages/friendPage/friend';
import Pusher from "pusher-js";

import {
  BrowserRouter as Router,
  Routes,
  Route, 
  Navigate
} from "react-router-dom";
import { useContext,useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { UpdateSuccess } from "./context/AuthAction";

function App() {
  const { user,dispatch } = useContext(AuthContext); 

  useEffect(()=>{
    const pusher = new Pusher("64873375849c544489d1", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("user");
    channel.bind("update", function (data) {
      const updatedUser = data.user;
      console.log("trigger")
      console.log(data.user)
      if (updatedUser._id==user?._id) {
        console.log("cap nhat avatar "+user.username)
        dispatch(UpdateSuccess(updatedUser));
      }
    });

    return () => {
      channel.unbind("update");
      channel.unsubscribe();
    }
  },[user])


  return (
     <Router>
       <Routes>
         <Route path = "/" element = { user ? <Home /> : <SignIn />} />
         <Route path = "/signIn" element = { user ? <Navigate  to = "/" /> : <SignIn />} />
         <Route path = "/signUp" element = { user ? <Navigate  to = "/" /> : <SignUp />} />
         <Route path = "/friend" element = { !user? <Navigate  to = "/" /> : <Friend />} />
       </Routes>
     </Router>
    // <Router>
    //    <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/signIn" element={<SignIn />} />
    //     <Route path="/signUp" element={<SignUp />} />
    //     <Route path="/friend" element={<Friend />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
