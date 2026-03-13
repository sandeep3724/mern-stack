import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);

const handleSubmit = async(e)=>{

e.preventDefault();

setLoading(true);

try{

const res = await axios.post(
"https://mern-stack-qrcp.onrender.com/api/auth/login",
{ email,password }
);

localStorage.setItem("token",res.data.token);
localStorage.setItem("role",res.data.user.role);

toast.success("Login successful 🎉");

setIsLoggedIn(true);

if(res.data.user.role==="admin"){
navigate("/admin");
}else{
navigate("/");
}

}catch(err){

toast.error(
err.response?.data?.message || "Login failed"
);

}

setLoading(false);

};

return(

<div className="auth-page">

<div className="auth-card">

<h2 className="auth-title">Welcome Back</h2>

<p className="auth-sub">
Login to continue ordering food
</p>

<form className="auth-form" onSubmit={handleSubmit}>

<div className="form-group">

<label>Email</label>

<input
type="email"
placeholder="Enter email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>

<div className="form-group">

<label>Password</label>

<input
type="password"
placeholder="Enter password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

</div>

<button
className="auth-btn"
type="submit"
disabled={loading}
>

{loading ? "Logging in..." : "Login"}

</button>

<p className="auth-switch">

New user?

<button
type="button"
className="link-btn"
onClick={()=>navigate("/register")}
>
Create account
</button>

</p>

</form>

</div>

</div>

);

}

export default Login;