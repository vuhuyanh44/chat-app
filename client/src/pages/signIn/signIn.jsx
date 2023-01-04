import "./signIn.css";
import { loginCall } from "../../loginCall";
import { useContext, useRef,useEffect,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function SignIn() {

  const username= useRef();
  const password= useRef();
  const [formWarning,setFormWarning]= useState("");
  const {error,dispatch} =useContext(AuthContext);
  const handleSubmit = (e)=>{
    e.preventDefault();
    const userCredentials= {username:username.current.value,password:password.current.value};
    console.log(userCredentials);
    loginCall(userCredentials,dispatch);
    
  };

  useEffect(()=>{
    if(error==true){
      setFormWarning("Có gì đó sai sai. Vui lòng thử lại")
    }
  },[error]);

  const handleFocus= ()=>{
    setFormWarning("");
  }

  return (
    <div className="signIn">
      <div className="signInWrapper">
        
        <div className="signInContainer">
          <div className="signInContent">

            <div className= "signInHeader">
              <h4 className="signInTitle">The 48 Hours</h4>
              <h4>Sign In</h4>
              <p>Sign in to connect to The 48 Hours</p>

            </div>
            <div className="signInForm">
              <div className="signInFormContainer">

                <form className="signInBox">
                  <div>
                    <label>Username</label>
                    <input placeholder="Username" required className="signInInput" ref={username} onFocus={handleFocus} />
                  </div>
                  <div>
                    <label>Password</label>
                    <input
                    placeholder="Password"
                    type="password"
                    required
                    className="signInInput"
                    ref={password}
                    onFocus={handleFocus}
                  />
                  </div>
              
                  <h4 style={{color: "red",display:"block",height:20 }}>
                    {formWarning}
                  </h4>
                  <button className="signInButton" type="submit"onClick={handleSubmit}>
                    Sign In
                  </button>
                </form>
              </div>
            </div>
            <div className="signInFooter">
              <p>Don't have accounts? 
                <a href="http://localhost:3000/signUp" style={{color: "#7269ef"}}> Signup now</a>
              </p>
              <p>© 2022 Chat Application by The 48 Hours Team</p>
            </div>

            

          </div>
          
          
        </div>
        
      </div>
    </div>
    
  );
}
