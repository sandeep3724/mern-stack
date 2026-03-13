import React,{useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register(){

const navigate = useNavigate();

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [loading,setLoading]=useState(false);

const handleRegister=async(e)=>{

e.preventDefault();

setLoading(true);

try{

await axios.post(
"https://mern-stack-qrcp.onrender.com/api/auth/register",
{ name,email,password }
);

toast.success("Registration successful 🎉");

setTimeout(()=>{
navigate("/login");
},800);

}catch(err){

toast.error(
err.response?.data?.message || "Registration failed"
);

}

setLoading(false);

};

return(

<div className="auth-page">

<div className="auth-card">

<h2 className="auth-title">
Create Account
</h2>

<p className="auth-sub">
Join and start ordering food
</p>

<form className="auth-form" onSubmit={handleRegister}>

<div className="form-group">

<label>Name</label>

<input
type="text"
placeholder="Enter name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

</div>

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

{loading ? "Creating..." : "Register"}

</button>

<p className="auth-switch">

Already have account?

<button
type="button"
className="link-btn"
onClick={()=>navigate("/login")}
>
Login
</button>

</p>

</form>

</div>

</div>

);

}

export default Register;