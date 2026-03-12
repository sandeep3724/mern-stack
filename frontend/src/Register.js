import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function Register(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);

const handleRegister = async(e)=>{

e.preventDefault();

setLoading(true);

try{

await axios.post(
"http://https://mern-stack-qrcp.onrender.com/api/auth/register",
{ name,email,password }
);

toast.success("Registration successful 🎉");

/* redirect to login after 1 second */

setTimeout(()=>{
navigate("/login");
},1000);

}catch(err){

const message = err.response?.data?.message;

if(message === "User already exists"){
toast.error("User already exists ❌");
}else{
toast.error("Registration failed");
}

}finally{

setLoading(false);

}

};

return(

<div className="auth-page">

<div className="auth-card">

<h2 className="auth-title">Register</h2>

<form onSubmit={handleRegister}>

<div className="form-group">

<label>Name</label>

<input
type="text"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

</div>

<div className="form-group">

<label>Email</label>

<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>

<div className="form-group">

<label>Password</label>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

</div>

<button className="auth-btn" type="submit" disabled={loading}>

{loading ? "Registering..." : "Register"}

</button>

<p className="auth-switch">
Already have an account?
</p>

<button
type="button"
className="link-btn"
onClick={()=>navigate("/login")}
>
Login
</button>

</form>

</div>

<ToastContainer position="top-right" autoClose={2000}/>

</div>

);

}

export default Register;