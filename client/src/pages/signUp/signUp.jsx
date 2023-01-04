import "./signUp.css";
import { useContext, useRef,useEffect,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
import {SignUpFailure,SignUpStart,SignUpSuccess} from "../../context/AuthAction"


export default function SignUp() {

  const username= useRef();
  const password= useRef();
  const name= useRef();
  const checkedPassword=useRef(); 
  const navigate = useNavigate();
  const {error,dispatch}=useContext(AuthContext);
  const [formWarning,setFormWarning]= useState("");

  const handleSubmit=async (e)=>{ 
    e.preventDefault();
    const user = {
      username: username.current.value,
      name: name.current.value,
      password: password.current.value,
      friends:[],
      avatarURL:"https://res.cloudinary.com/dtm8ojbfl/image/upload/v1653402078/avatar-17-48_exd3sd.png"

    };

    if(password.current.value===checkedPassword.current.value &&password.current.value.length>5){
      
      dispatch(SignUpStart());
      try {
        const res= await axios.post("/auth/sign-up", user);
        console.log(res.data.status);
        if(res.data.status==='success sign up'){
          dispatch(SignUpSuccess());
          
          navigate('/signin');
        }
        else{ 
          dispatch(SignUpFailure("Đăng kí thất bại"));
          setFormWarning("Tài khoản đã tồn tại")
        }

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    else if(password.current.value.length<=5)
    {
      setFormWarning("Mật khẩu không đủ mạnh")
    }
    else if(password.current.value!==checkedPassword.current.value){
      
      setFormWarning("Kiểm tra lại mật khẩu của bạn")
    }
    
    
  }

  const handleFocus =()=>{
    setFormWarning("");
    dispatch(SignUpStart());
    
  }
  
  return (
    <div className="signIn">
    <div className="signInWrapper">
      
      <div className="signInContainer">
        <div className="signInContent">

          <div className= "signInHeader">
            <h4 className="signInTitle">The 48 Hours</h4>
            <h4>Sign up</h4>
            <p>Get your The 48 Hours account now. </p>

          </div>
          <div className="signInForm">
            <div className="signInFormContainer">

              <form className="signInBox">
                <div>
                  <label>Username</label>
                  <input placeholder="Username" required className="signInInput" ref={username} onFocus={handleFocus} />
                </div>
                <div>
                  <label>Name</label>
                  <input placeholder="Username" required className="signInInput" ref={name} onFocus={handleFocus} />
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
                <div>
                  <label>Password Again</label>
                  <input
                  placeholder="Password"
                  type="password"
                  required
                  className="signInInput"
                  ref={checkedPassword}
                  onFocus={handleFocus}
                />
                </div>
            
                <h4 style={{color: "red",display:"block",height:20 }}>
                  {formWarning}
                </h4>
                <button className="signInButton" type="submit"onClick={handleSubmit}>
                  Sign Up
                </button>
              </form>
            </div>
          </div>
          <div className="signInFooter">
            <p>Already have account? 
              <a href="http://localhost:3000/signIn" style={{color: "#7269ef"}}> Signin</a>
            </p>
            <p>© 2022 Chat Application by The 48 Hours Team</p>
          </div>

          

        </div>
        
        
      </div>
      
    </div>
  </div>
  );
}
